<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PresentationAnalytic extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_type',
        'slide_id',
        'data',
        'session_id',
        'presentation_id',
        'participant_id',
    ];

    protected $casts = [
        'data' => 'array',
    ];

    /**
     * Get the presentation this analytic belongs to.
     */
    public function presentation(): BelongsTo
    {
        return $this->belongsTo(Presentation::class);
    }

    /**
     * Get the participant this analytic belongs to.
     */
    public function participant(): BelongsTo
    {
        return $this->belongsTo(Participant::class);
    }

    /**
     * Get the slide this analytic is for.
     */
    public function slide(): BelongsTo
    {
        return $this->belongsTo(Slide::class);
    }
} 