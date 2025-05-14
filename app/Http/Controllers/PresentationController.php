<?php

namespace App\Http\Controllers;

use App\Models\Presentation;
use App\Models\Slide;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PresentationController extends Controller
{
    /**
     * Display a listing of the presentations.
     */
    public function index()
    {
        $presentations = Auth::user()->presentations()
            ->with(['slides' => function($query) {
                $query->orderBy('order', 'asc')->limit(1);
            }])
            ->orderBy('created_at', 'desc')
            ->get();
        
        return Inertia::render('Presentations/Index', [
            'presentations' => $presentations,
        ]);
    }

    /**
     * Show the form for creating a new presentation.
     */
    public function create()
    {
        return Inertia::render('Presentations/Create');
    }

    /**
     * Store a newly created presentation in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_public' => 'boolean',
            'theme' => 'string|max:255',
        ]);

        $presentation = Auth::user()->presentations()->create([
            'title' => $request->title,
            'description' => $request->description,
            'is_public' => $request->is_public ?? true,
            'theme' => $request->theme ?? 'default',
            'presenter_password' => Str::random(8),
        ]);

        // Create a default title slide
        $presentation->slides()->create([
            'title' => $request->title,
            'type' => 'title',
            'order' => 0,
            'template' => 'title',
            'content' => [
                'title' => $request->title,
                'subtitle' => $request->description,
            ],
        ]);

        return redirect()->route('presentations.edit', $presentation);
    }

    /**
     * Display the specified presentation.
     */
    public function show(Presentation $presentation)
    {
        $this->authorize('view', $presentation);
        
        $presentation->load('slides');
        
        return Inertia::render('Presentations/Show', [
            'presentation' => $presentation,
        ]);
    }

    /**
     * Show the form for editing the specified presentation.
     */
    public function edit(Presentation $presentation)
    {
        $this->authorize('update', $presentation);
        
        $presentation->load('slides');
        
        return Inertia::render('Presentations/Edit', [
            'presentation' => $presentation,
        ]);
    }

    /**
     * Update the specified presentation in storage.
     */
    public function update(Request $request, Presentation $presentation)
    {
        $this->authorize('update', $presentation);
        
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_public' => 'boolean',
            'theme' => 'string|max:255',
        ]);

        $presentation->update([
            'title' => $request->title,
            'description' => $request->description,
            'is_public' => $request->is_public,
            'theme' => $request->theme,
        ]);

        return redirect()->route('presentations.edit', $presentation)
            ->with('success', 'Presentation updated successfully.');
    }

    /**
     * Remove the specified presentation from storage.
     */
    public function destroy(Presentation $presentation)
    {
        $this->authorize('delete', $presentation);
        
        $presentation->delete();
        
        return redirect()->route('presentations.index')
            ->with('success', 'Presentation deleted successfully.');
    }

    /**
     * Present mode for the audience.
     */
    public function present($uid)
    {
        $presentation = Presentation::where('uid', $uid)->firstOrFail();
        $presentation->load('slides');
        
        return Inertia::render('Presentations/Present', [
            'presentation' => $presentation,
            'isPresenter' => false,
        ]);
    }

    /**
     * Present mode for the presenter.
     */
    public function presenterMode(Request $request, $uid)
    {
        $presentation = Presentation::where('uid', $uid)->firstOrFail();
        
        if ($request->isMethod('post')) {
            $request->validate([
                'password' => 'required|string',
            ]);
            
            if ($request->password !== $presentation->presenter_password) {
                return back()->with('error', 'Invalid presenter password.');
            }
            
            $request->session()->put('presenter_' . $presentation->id, true);
        } else {
            if (!$request->session()->has('presenter_' . $presentation->id)) {
                return Inertia::render('Presentations/PresenterAuth', [
                    'presentation' => [
                        'id' => $presentation->id,
                        'title' => $presentation->title,
                        'uid' => $presentation->uid,
                    ],
                ]);
            }
        }
        
        $presentation->load('slides');
        
        return Inertia::render('Presentations/Present', [
            'presentation' => $presentation,
            'isPresenter' => true,
        ]);
    }
} 