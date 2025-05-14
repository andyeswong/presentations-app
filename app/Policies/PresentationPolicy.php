<?php

namespace App\Policies;

use App\Models\Presentation;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PresentationPolicy
{
    /**
     * Determine whether the user can view any presentations.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the presentation.
     */
    public function view(User $user, Presentation $presentation): bool
    {
        return $user->id === $presentation->user_id || $presentation->is_public;
    }

    /**
     * Determine whether the user can create presentations.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the presentation.
     */
    public function update(User $user, Presentation $presentation): bool
    {
        return $user->id === $presentation->user_id;
    }

    /**
     * Determine whether the user can delete the presentation.
     */
    public function delete(User $user, Presentation $presentation): bool
    {
        return $user->id === $presentation->user_id;
    }

    /**
     * Determine whether the user can restore the presentation.
     */
    public function restore(User $user, Presentation $presentation): bool
    {
        return $user->id === $presentation->user_id;
    }

    /**
     * Determine whether the user can permanently delete the presentation.
     */
    public function forceDelete(User $user, Presentation $presentation): bool
    {
        return $user->id === $presentation->user_id;
    }
} 