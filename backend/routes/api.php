<?php

use App\Http\Controllers\WelcomePhraseController;
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
    Route::get('user', function (Request $request) {
        return $request->user();
    })->middleware('auth:sanctum');


    // ==============
    // Private routes
    // ==============
    Route::middleware('jwt.auth')->group(function () {
        Route::get('me', [JwtAuthController::class, 'me']);
        Route::post('logout', [JwtAuthController::class, 'logout']);
    });
});
