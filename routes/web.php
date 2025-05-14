<?php

use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\PresentationAnalyticController;
use App\Http\Controllers\PresentationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SlideController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    Route::resource('presentations', PresentationController::class);
    
    Route::post('/presentations/{presentation}/slides', [SlideController::class, 'store'])->name('slides.store');
    Route::put('/slides/{slide}', [SlideController::class, 'update'])->name('slides.update');
    Route::delete('/slides/{slide}', [SlideController::class, 'destroy'])->name('slides.destroy');
    Route::post('/slides/{slide}/duplicate', [SlideController::class, 'duplicate'])->name('slides.duplicate');
    Route::post('/presentations/{presentation}/slides/order', [SlideController::class, 'updateOrder'])->name('slides.order');
    
    Route::get('/presentations/{presentation}/analytics', [PresentationAnalyticController::class, 'getAnalytics'])->name('presentations.analytics');
    Route::get('/presentations/{presentation}/analytics/summary', [PresentationAnalyticController::class, 'getSummary'])->name('presentations.analytics.summary');
    
    Route::get('/presentations/{presentation}/participants', [ParticipantController::class, 'getParticipants'])->name('presentations.participants');
});

Route::get('/p/{uid}', [PresentationController::class, 'present'])->name('present');
Route::match(['get', 'post'], '/p/{uid}/presenter', [PresentationController::class, 'presenterMode'])->name('presenter');

Route::post('/p/{uid}/register', [ParticipantController::class, 'register'])->name('participant.register');
Route::post('/participant/update-slide', [ParticipantController::class, 'updateSlide'])->name('participant.update-slide');
Route::post('/participant/disconnect', [ParticipantController::class, 'disconnect'])->name('participant.disconnect');

Route::post('/analytics/track', [PresentationAnalyticController::class, 'track'])->name('analytics.track');

require __DIR__.'/auth.php';
