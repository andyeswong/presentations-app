<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Participant extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'session_id',
        'current_slide',
        'is_active',
        'last_activity',
        'device_info',
        'presentation_id',
        'user_id',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'last_activity' => 'datetime',
        'device_info' => 'array',
    ];

    /**
     * Get the presentation this participant is viewing.
     */
    public function presentation(): BelongsTo
    {
        return $this->belongsTo(Presentation::class);
    }

    /**
     * Get the user if the participant is logged in.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
} 