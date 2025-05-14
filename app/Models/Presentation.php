<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Presentation extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'slug',
        'uid',
        'theme',
        'is_public',
        'presenter_password',
        'user_id',
    ];

    protected $casts = [
        'is_public' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($presentation) {
            // Generate a unique UID for sharing the presentation
            $presentation->uid = Str::uuid();
            
            // Generate a slug from the title
            $presentation->slug = Str::slug($presentation->title);
        });
    }

    /**
     * Get the user that owns the presentation.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the slides for this presentation.
     */
    public function slides(): HasMany
    {
        return $this->hasMany(Slide::class)->orderBy('order');
    }

    /**
     * Get the participants/audience members for this presentation.
     */
    public function participants(): HasMany
    {
        return $this->hasMany(Participant::class);
    }

    /**
     * Get the presentation analytics.
     */
    public function analytics(): HasMany
    {
        return $this->hasMany(PresentationAnalytic::class);
    }
} 