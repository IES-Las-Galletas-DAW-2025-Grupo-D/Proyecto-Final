<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\JwtService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class JwtAuthController extends Controller
{
  protected $jwtService;

  public function __construct(JwtService $jwtService)
  {
    $this->jwtService = $jwtService;
  }

  /**
   * Log in the user and generate a JWT token
   *
   * @param Request $request
   * @return \Illuminate\Http\JsonResponse
   */
  public function login(Request $request)
  {


    if (!$request->has('usernameOrEmail') || !$request->has('password')) {
      throw ValidationException::withMessages([
        'usernameOrEmail' => ['The usernameOrEmail field is required.'],
        'password' => ['The password field is required.'],
      ]);
    }
    $credentials = [
      'name' => $request->input('usernameOrEmail'),
      'password' => $request->input('password'),
    ];

    if (!Auth::attempt($credentials)) {
      throw ValidationException::withMessages([
        'usernameOrEmail' => ['The provided credentials are incorrect.'],
      ]);
    }

    $user = Auth::user();

    $token = $this->jwtService->generateToken([
      'sub' => $user->id,
      'name' => $user->name,
      'email' => $user->email,
    ]);

    return response()->json([
      'token' => $token,
    ]);
  }

  /**
   * Get the authenticated user's data
   *
   * @param Request $request
   * @return \Illuminate\Http\JsonResponse
   */
  public function me(Request $request)
  {
    return response()->json(Auth::user());
  }

  /**
   * Log out the user
   *
   * @return \Illuminate\Http\JsonResponse
   */
  public function logout()
  {
    Auth::logout();
    return response()->json(['message' => 'Disconnected successfully']);
  }
}
