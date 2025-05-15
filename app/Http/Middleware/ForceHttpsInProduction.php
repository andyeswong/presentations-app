<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Config;

class ForceHttpsInProduction
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if we should force HTTPS (environments: production or prod) and config allows it
        $isProduction = in_array(app()->environment(), ['production', 'prod']);
        $forceHttps = Config::get('security.force_https', true);
        
        if ($isProduction && $forceHttps && !$request->secure()) {
            // If we're not on HTTPS, redirect to HTTPS
            return redirect()->secure($request->getRequestUri());
        }

        // Add security headers for HTTPS connections in production
        if ($isProduction && $forceHttps && $request->secure()) {
            $response = $next($request);
            
            // Build HSTS header value from config
            $hstsConfig = Config::get('security.hsts', [
                'max_age' => 31536000,
                'include_subdomains' => true,
                'preload' => false
            ]);
            
            $hstsValue = 'max-age=' . $hstsConfig['max_age'];
            if ($hstsConfig['include_subdomains']) {
                $hstsValue .= '; includeSubDomains';
            }
            if ($hstsConfig['preload']) {
                $hstsValue .= '; preload';
            }
            
            // Add HSTS header
            $response->headers->set('Strict-Transport-Security', $hstsValue);
            
            // Add other security headers from config
            $headers = Config::get('security.headers', []);
            
            if (isset($headers['x_content_type_options'])) {
                $response->headers->set('X-Content-Type-Options', $headers['x_content_type_options']);
            }
            
            if (isset($headers['x_xss_protection'])) {
                $response->headers->set('X-XSS-Protection', $headers['x_xss_protection']);
            }
            
            if (isset($headers['x_frame_options'])) {
                $response->headers->set('X-Frame-Options', $headers['x_frame_options']);
            }
            
            if (isset($headers['referrer_policy'])) {
                $response->headers->set('Referrer-Policy', $headers['referrer_policy']);
            }
            
            return $response;
        }

        return $next($request);
    }
}
