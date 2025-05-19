<?php

use App\Http\Controllers\WelcomePhraseController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\EventController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\JwtAuthController;

Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});

Route::get('/welcome-phrase', [WelcomePhraseController::class, 'index']);

Route::prefix('v1')->group(function () {
    Route::get('welcome-phrase', [WelcomePhraseController::class, 'index']);

    // ==============
    // Public routes
    // ==============
    Route::post('login', [JwtAuthController::class, 'login']);
    Route::post('register', [JwtAuthController::class, 'register']);
  

    // ==============
    // Private routes
    // ==============
    Route::middleware('jwt.auth')->group(function () {
        Route::get('me', [JwtAuthController::class, 'me']);
        Route::post('logout', [JwtAuthController::class, 'logout']);
        Route::get('user', function (Request $request) {
            return $request->user();
        });

        // Project routes
        Route::apiResource('projects', ProjectController::class);
        Route::get('projects/{id}/events', [ProjectController::class, 'events']);

        // Event routes
        Route::apiResource('events', EventController::class);
        Route::post('events/{id}/permissions', [EventController::class, 'addPermission']);
        Route::delete('events/{id}/permissions', [EventController::class, 'removePermission']);
    });
});
