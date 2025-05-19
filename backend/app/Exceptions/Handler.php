<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

class Handler extends ExceptionHandler
{
  public function render($request, Throwable $exception)
  {
    if ($request->is('api/*') || $request->expectsJson()) {
      if ($exception instanceof \Illuminate\Validation\ValidationException) {
        return response()->json([
          'message' => 'Validation failed',
          'errors' => $exception->errors(),
        ], 422);
      }

      if ($exception instanceof \Symfony\Component\HttpKernel\Exception\NotFoundHttpException) {
        return response()->json(['message' => 'Not found'], 404);
      }

      if ($exception instanceof \Illuminate\Auth\AuthenticationException) {
        return response()->json(['message' => 'Unauthenticated'], 401);
      }
      // fallback
      return response()->json([
        'message' => $exception->getMessage(),
      ], $exception instanceof HttpExceptionInterface ? $exception->getStatusCode() : 500);
    }

    return parent::render($request, $exception);
  }
}
