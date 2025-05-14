<?php

namespace App\Http\Controllers;

use App\Models\Participant;
use App\Models\Presentation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class ParticipantController extends Controller
{
    /**
     * Register a new participant for a presentation.
     */
    public function register(Request $request, $uid)
    {
        $presentation = Presentation::where('uid', $uid)->firstOrFail();
        
        $request->validate([
            'name' => 'nullable|string|max:255',
        ]);

        // Create or update the participant based on session
        $sessionId = $request->session()->getId();
        
        $participant = Participant::updateOrCreate(
            [
                'session_id' => $sessionId,
                'presentation_id' => $presentation->id
            ],
            [
                'name' => $request->name ?? 'Anonymous',
                'user_id' => Auth::id(),
                'is_active' => true,
                'last_activity' => now(),
                'device_info' => [
                    'user_agent' => $request->userAgent(),
                    'ip' => $request->ip(),
                ],
                'current_slide' => 0,
            ]
        );

        return response()->json([
            'participant' => $participant,
            'sessionId' => $sessionId,
        ]);
    }

    /**
     * Update the current slide position for a participant.
     */
    public function updateSlide(Request $request)
    {
        $request->validate([
            'session_id' => 'nullable|string',
            'slide_number' => 'required|integer',
            'presentation_uid' => 'nullable|string',
            'is_presenter' => 'nullable|boolean',
        ]);

        // Case 1: Presenter is changing slides and broadcasting to audience
        if ($request->is_presenter && $request->presentation_uid) {
            $presentation = Presentation::where('uid', $request->presentation_uid)->first();
            
            if (!$presentation) {
                return response()->json(['error' => 'Presentation not found'], 404);
            }
            
            // Broadcast the slide change to all users on the presentation channel
            event(new \App\Events\SlideChanged(
                $request->presentation_uid,
                $request->slide_number
            ));
            
            return response()->json(['message' => 'Slide change broadcasted to audience']);
        }
        
        // Case 2: Regular participant tracking their current slide
        if ($request->session_id) {
            $participant = Participant::where('session_id', $request->session_id)->first();
            
            if (!$participant) {
                return response()->json(['error' => 'Participant not found'], 404);
            }
    
            $participant->update([
                'current_slide' => $request->slide_number,
                'last_activity' => now(),
                'is_active' => true,
            ]);
    
            return response()->json(['message' => 'Slide position updated']);
        }
        
        return response()->json(['error' => 'Invalid request parameters'], 400);
    }

    /**
     * Mark a participant as inactive.
     */
    public function disconnect(Request $request)
    {
        $request->validate([
            'session_id' => 'required|string',
        ]);

        $participant = Participant::where('session_id', $request->session_id)->first();
        
        if ($participant) {
            $participant->update([
                'is_active' => false,
            ]);
        }

        return response()->json(['message' => 'Participant marked as inactive']);
    }

    /**
     * Get all active participants for a presentation.
     */
    public function getParticipants(Presentation $presentation)
    {
        $this->authorize('view', $presentation);
        
        $participants = $presentation->participants()
            ->where('is_active', true)
            ->orderBy('last_activity', 'desc')
            ->get();
            
        return response()->json(['participants' => $participants]);
    }
} 