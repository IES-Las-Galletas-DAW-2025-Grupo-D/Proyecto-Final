<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Services\JwtService;
use Illuminate\Support\Facades\Auth;

class JwtAuthentication
{
    protected $jwtService;

    public function __construct(JwtService $jwtService)
    {
        $this->jwtService = $jwtService;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();

        // Use the service method for authentication
        $result = $this->jwtService->authenticateWithToken($token);

        // If authentication failed, return error response
        if (!$result['success']) {
            return response()->json(['error' => $result['error']], $result['code']);
        }

        // Login the user
        Auth::login($result['user']);

        return $next($request);
    }
}
