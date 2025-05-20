<?php

namespace App\Providers;

use Illuminate\Pagination\Paginator;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\URL;

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
        Response::macro('api', function ($value, $status = 200) {
            return response()->json($value, $status, ['Content-Type' => 'application/json']);
        });

        URL::forceRootUrl('/');
        Paginator::currentPathResolver(function () {
            return request()->path();
        });
    }
}
