<?php

namespace App\Providers;

use App\Services\JwtService;
use Illuminate\Support\ServiceProvider;

class JwtServiceProvider extends ServiceProvider
{
  /**
   * Register services.
   *
   * @return void
   */
  public function register()
  {
    $this->app->singleton(JwtService::class, function ($app) {
      return new JwtService();
    });

    $this->mergeConfigFrom(
      __DIR__ . '/../../config/jwt.php',
      'jwt'
    );
  }

  /**
   * Bootstrap services.
   *
   * @return void
   */
  public function boot()
  {
    $this->publishes([
      __DIR__ . '/../../config/jwt.php' => config_path('jwt.php'),
    ], 'jwt-config');
  }
}
