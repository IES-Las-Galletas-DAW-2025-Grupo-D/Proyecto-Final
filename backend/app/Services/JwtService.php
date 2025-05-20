<?php

namespace App\Services;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Carbon;

class JwtService
{
    /**
     * Generate a JWT token
     *
     * @param array $claims
     * @return string
     */
    public function generateToken(array $claims = []): string
    {
        $ttl = (int) config('jwt.ttl', 60);

        $payload = array_merge([
            'iss' => config('app.url'),
            'iat' => Carbon::now()->timestamp,
            'exp' => Carbon::now()->addMinutes($ttl)->timestamp,
        ], $claims);

        return JWT::encode($payload, $this->getSecretKey(), 'HS256');
    }

    /**
     * Verify and decode a JWT token
     *
     * @param string $token
     * @return object|null
     */
    public function verifyToken(string $token)
    {
        try {
            return JWT::decode($token, new Key($this->getSecretKey(), 'HS256'));
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Check if token is expired
     *
     * @param string $token
     * @return bool
     */
    public function isTokenExpired(string $token): bool
    {
        $payload = $this->verifyToken($token);

        if (!$payload || !isset($payload->exp)) {
            return true;
        }

        return Carbon::now()->timestamp > $payload->exp;
    }

    /**
     * Get all claims from a token
     *
     * @param string $token
     * @return array|null
     */
    public function getClaims(string $token)
    {
        $payload = $this->verifyToken($token);
        return $payload ? (array) $payload : null;
    }

    /**
     * Get a specific claim from a token
     *
     * @param string $token
     * @param string $claim
     * @return mixed|null
     */
    public function getClaim(string $token, string $claim)
    {
        $payload = $this->verifyToken($token);
        return $payload && isset($payload->{$claim}) ? $payload->{$claim} : null;
    }

    /**
     * Get the secret key used for JWT operations
     *
     * @return string
     */
    protected function getSecretKey(): string
    {
        return config('jwt.secret', env('JWT_SECRET'));
    }

    /**
     * Authenticate a user with a JWT token
     *
     * @param string $token
     * @return array Result with authenticated user or error
     */
    public function authenticateWithToken(string $token): array
    {
        // Check if token exists
        if (!$token) {
            return ['success' => false, 'error' => 'Token not provided', 'code' => 401];
        }

        // Check if token is expired
        if ($this->isTokenExpired($token)) {
            return ['success' => false, 'error' => 'Expired token', 'code' => 401];
        }

        // Get claims from token
        $claims = $this->getClaims($token);

        // Check if 'sub' claim exists
        if (!isset($claims['sub'])) {
            return ['success' => false, 'error' => 'Invalid token', 'code' => 401];
        }

        // Find the user
        $user = \App\Models\User::find($claims['sub']);

        // Check if user exists
        if (!$user) {
            return ['success' => false, 'error' => 'User not found', 'code' => 401];
        }

        // Authentication successful
        return ['success' => true, 'user' => $user];
    }
}
