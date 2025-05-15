<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Config;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Force HTTPS in production
        $isProduction = in_array(app()->environment(), ['production', 'prod']);
        $forceHttps = Config::get('security.force_https', true);
        
        if ($isProduction && $forceHttps) {
            URL::forceScheme('https');
        }
    }
}
