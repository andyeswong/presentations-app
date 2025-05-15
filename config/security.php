<?php

return [
    /*
    |--------------------------------------------------------------------------
    | HTTPS Enforcement
    |--------------------------------------------------------------------------
    |
    | If you're running in production, you may want to force all access to the 
    | application over HTTPS. This configuration option allows you to control
    | this behavior.
    |
    */
    'force_https' => env('FORCE_HTTPS', true),

    /*
    |--------------------------------------------------------------------------
    | HTTP Strict Transport Security
    |--------------------------------------------------------------------------
    |
    | HSTS header options, only applied when force_https is true and the app
    | environment is production or prod.
    |
    */
    'hsts' => [
        'max_age' => 31536000, // 1 year in seconds
        'include_subdomains' => true,
        'preload' => false,
    ],

    /*
    |--------------------------------------------------------------------------
    | Security Headers
    |--------------------------------------------------------------------------
    |
    | Additional security headers to be added in production environments.
    |
    */
    'headers' => [
        'x_content_type_options' => 'nosniff',
        'x_xss_protection' => '1; mode=block',
        'x_frame_options' => 'SAMEORIGIN',
        'referrer_policy' => 'strict-origin-when-cross-origin',
    ],
]; 