<?php

namespace App\Http\Controllers;

use App\Models\Presentation;
use App\Models\Slide;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SlideController extends Controller
{
    /**
     * Store a newly created slide in storage.
     */
    public function store(Request $request, Presentation $presentation)
    {
        $this->authorize('update', $presentation);
        
        $request->validate([
            'title' => 'nullable|string|max:255',
            'type' => 'required|string|max:255',
            'template' => 'nullable|string|max:255',
            'content' => 'nullable|array',
        ]);

        // Get the highest order value for current slides
        $maxOrder = $presentation->slides()->max('order') ?? -1;
        
        $slide = $presentation->slides()->create([
            'title' => $request->title,
            'type' => $request->type,
            'template' => $request->template ?? 'default',
            'content' => $request->content ?? [],
            'order' => $maxOrder + 1,
        ]);

        return response()->json($slide);
    }

    /**
     * Update the specified slide in storage.
     */
    public function update(Request $request, Slide $slide)
    {
        $this->authorize('update', $slide->presentation);
        
        $request->validate([
            'title' => 'nullable|string|max:255',
            'type' => 'nullable|string|max:255',
            'template' => 'nullable|string|max:255',
            'content' => 'nullable|array',
            'order' => 'nullable|integer',
            'settings' => 'nullable|array',
        ]);

        $slide->update($request->all());

        return response()->json($slide);
    }

    /**
     * Update the order of multiple slides at once.
     */
    public function updateOrder(Request $request, Presentation $presentation)
    {
        $this->authorize('update', $presentation);
        
        $request->validate([
            'slides' => 'required|array',
            'slides.*.id' => 'required|exists:slides,id',
            'slides.*.order' => 'required|integer',
        ]);

        foreach ($request->slides as $slideData) {
            $slide = Slide::find($slideData['id']);
            
            // Ensure the slide belongs to this presentation
            if ($slide->presentation_id === $presentation->id) {
                $slide->update(['order' => $slideData['order']]);
            }
        }

        return response()->json(['message' => 'Slide order updated successfully']);
    }

    /**
     * Remove the specified slide from storage.
     */
    public function destroy(Slide $slide)
    {
        $this->authorize('update', $slide->presentation);
        
        $presentation = $slide->presentation;
        $slide->delete();
        
        // Reorder the remaining slides
        $remainingSlides = $presentation->slides()->orderBy('order')->get();
        
        foreach ($remainingSlides as $index => $slide) {
            $slide->update(['order' => $index]);
        }

        return response()->json(['message' => 'Slide deleted successfully']);
    }

    /**
     * Duplicate a slide.
     */
    public function duplicate(Slide $slide)
    {
        $this->authorize('update', $slide->presentation);
        
        $presentation = $slide->presentation;
        
        // Get the highest order value for current slides
        $maxOrder = $presentation->slides()->max('order');
        
        $newSlide = $slide->replicate();
        $newSlide->order = $maxOrder + 1;
        $newSlide->title = $slide->title . ' (Copy)';
        $newSlide->save();

        return response()->json($newSlide);
    }
} 