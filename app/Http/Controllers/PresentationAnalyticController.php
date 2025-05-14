<?php

namespace App\Http\Controllers;

use App\Models\Participant;
use App\Models\Presentation;
use App\Models\PresentationAnalytic;
use Illuminate\Http\Request;

class PresentationAnalyticController extends Controller
{
    /**
     * Track an analytic event for a presentation.
     */
    public function track(Request $request)
    {
        $request->validate([
            'session_id' => 'required|string',
            'presentation_uid' => 'required|string',
            'event_type' => 'required|string',
            'slide_id' => 'nullable|integer',
            'data' => 'nullable|array',
        ]);

        $presentation = Presentation::where('uid', $request->presentation_uid)->firstOrFail();
        $participant = Participant::where('session_id', $request->session_id)
            ->where('presentation_id', $presentation->id)
            ->first();

        $analytic = new PresentationAnalytic([
            'event_type' => $request->event_type,
            'slide_id' => $request->slide_id,
            'data' => $request->data,
            'session_id' => $request->session_id,
            'presentation_id' => $presentation->id,
            'participant_id' => $participant ? $participant->id : null,
        ]);

        $analytic->save();

        return response()->json(['message' => 'Event tracked successfully']);
    }

    /**
     * Get analytics data for a presentation.
     */
    public function getAnalytics(Presentation $presentation)
    {
        $this->authorize('view', $presentation);

        $analytics = $presentation->analytics()
            ->with('participant')
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        return response()->json(['analytics' => $analytics]);
    }

    /**
     * Get summary of analytics for a presentation.
     */
    public function getSummary(Presentation $presentation)
    {
        $this->authorize('view', $presentation);

        // Total view count
        $viewCount = $presentation->participants()->count();

        // Most viewed slides
        $slideViews = $presentation->analytics()
            ->where('event_type', 'slide_view')
            ->selectRaw('slide_id, count(*) as views')
            ->groupBy('slide_id')
            ->orderByDesc('views')
            ->limit(10)
            ->get();

        // Active participants over time (last 24 hours in hourly intervals)
        $activeParticipants = $presentation->participants()
            ->where('last_activity', '>=', now()->subDay())
            ->selectRaw('DATE_FORMAT(last_activity, "%Y-%m-%d %H:00:00") as hour, count(*) as count')
            ->groupBy('hour')
            ->orderBy('hour')
            ->get();

        return response()->json([
            'viewCount' => $viewCount,
            'slideViews' => $slideViews,
            'activeParticipants' => $activeParticipants,
        ]);
    }
} 