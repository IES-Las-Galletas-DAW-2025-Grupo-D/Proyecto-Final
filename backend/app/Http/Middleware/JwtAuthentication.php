<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Services\JwtService;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

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

        if (!$token) {
            return response()->json(['error' => 'Token not provided'], 401);
        }

        if ($this->jwtService->isTokenExpired($token)) {
            return response()->json(['error' => 'Expired token'], 401);
        }

        $claims = $this->jwtService->getClaims($token);

        if (!isset($claims['sub'])) {
            return response()->json(['error' => 'Invalid token'], 401);
        }

        $user = User::find($claims['sub']);

        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado'], 401);
        }

        Auth::login($user);

        return $next($request);
    }
}
