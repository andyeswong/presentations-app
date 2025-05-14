<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Slide extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'type',
        'order',
        'template',
        'settings',
        'presentation_id',
    ];

    protected $casts = [
        'content' => 'array',
        'settings' => 'array',
    ];

    /**
     * Get the presentation that owns the slide.
     */
    public function presentation(): BelongsTo
    {
        return $this->belongsTo(Presentation::class);
    }
} 