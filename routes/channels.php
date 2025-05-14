<?php

use App\Models\Presentation;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

// User-specific channel
Broadcast::channel('user.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Public presentation channel (for audience)
Broadcast::channel('presentation.{uid}', function ($user, $uid) {
    // Public channel - anyone can join
    return true;
});

// Private presentation channel (for authenticated features)
Broadcast::channel('private-presentation-{id}', function ($user, $id) {
    $presentation = Presentation::find($id);
    
    if (!$presentation) {
        return false;
    }
    
    return $user->id === $presentation->user_id || $presentation->is_public;
});

// Presenter channel (only owner can join)
Broadcast::channel('private-presenter-{id}', function ($user, $id) {
    $presentation = Presentation::find($id);
    
    return $presentation && $user->id === $presentation->user_id;
});
