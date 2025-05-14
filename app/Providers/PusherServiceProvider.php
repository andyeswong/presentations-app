<?php

namespace App\Providers;

use App\Models\Presentation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\ServiceProvider;
use Pusher\Pusher;

class PusherServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind('pusher', function ($app) {
            $config = $app['config']['broadcasting.connections.pusher'];
            
            return new Pusher(
                $config['key'],
                $config['secret'],
                $config['app_id'],
                $config['options'] ?? []
            );
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Authentication logic for Pusher private channels
        $this->app['router']->post('/broadcasting/auth', function (Request $request) {
            $user = Auth::user();
            
            if (!$user) {
                abort(403);
            }
            
            // For private channels (user-specific)
            if (str_starts_with($request->channel_name, 'private-user-')) {
                $userId = (int) str_replace('private-user-', '', $request->channel_name);
                
                if ($user->id !== $userId) {
                    abort(403);
                }
                
                return $this->app['pusher']->socket_auth(
                    $request->channel_name,
                    $request->socket_id
                );
            }
            
            // For private presentation channels
            if (str_starts_with($request->channel_name, 'private-presentation-')) {
                $presentationId = (int) str_replace('private-presentation-', '', $request->channel_name);
                $presentation = Cache::remember("presentation-{$presentationId}", 60, function () use ($presentationId) {
                    return Presentation::find($presentationId);
                });
                
                if (!$presentation) {
                    abort(404);
                }
                
                // Check if user is the owner of the presentation or if it's public
                $canAccess = $user->id === $presentation->user_id || $presentation->is_public;
                
                if (!$canAccess) {
                    abort(403);
                }
                
                return $this->app['pusher']->socket_auth(
                    $request->channel_name,
                    $request->socket_id
                );
            }
            
            // For presenter channels
            if (str_starts_with($request->channel_name, 'private-presenter-')) {
                $presentationId = (int) str_replace('private-presenter-', '', $request->channel_name);
                $presentation = Cache::remember("presentation-{$presentationId}", 60, function () use ($presentationId) {
                    return Presentation::find($presentationId);
                });
                
                if (!$presentation || $user->id !== $presentation->user_id) {
                    abort(403);
                }
                
                return $this->app['pusher']->socket_auth(
                    $request->channel_name,
                    $request->socket_id
                );
            }
            
            abort(404);
        });
    }
} 