<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\JwtService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

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
    // Validate the request
    if (!$request->has('usernameOrEmail') || !$request->has('password')) {
      throw ValidationException::withMessages([
        'usernameOrEmail' => ['The usernameOrEmail field is required.'],
        'password' => ['The password field is required.'],
      ]);
    }

    // Validate the credentials
    $credentialsWithName = [
      'name' => $request->input('usernameOrEmail'),
      'password' => $request->input('password'),
    ];
    $credentialsWithEmail = [
      'email' => $request->input('usernameOrEmail'),
      'password' => $request->input('password'),
    ];
    if (!Auth::attempt($credentialsWithName) && !Auth::attempt($credentialsWithEmail)) {
      throw ValidationException::withMessages([
        'The provided credentials are incorrect.',
      ]);
    }

    // If the credentials are valid, get the authenticated user and generate a JWT token
    $user = Auth::user();

    $token = $this->jwtService->generateToken([
      'sub' => $user->id,
      'name' => $user->name,
      'email' => $user->email,
    ]);

    // Return the token in the response
    return response()->json([
      'token' => $token,
    ]);
  }

  /**
   * Register a new user
   *
   * @param Request $request
   * @return \Illuminate\Http\JsonResponse
   */
  public function register(Request $request)
  {
    // Validate the request
    $request->validate([
      'name' => 'required|string|max:255|unique:users',
      'email' => 'required|string|email|max:255|unique:users',
      'password' => 'required|string|min:8|confirmed',
    ]);

    // Create the new user
    $user = User::create([
      'name' => $request->name,
      'email' => $request->email,
      'password' => Hash::make($request->password),
    ]);

    // Authenticate the user
    Auth::login($user);

    // Generate JWT token
    $token = $this->jwtService->generateToken([
      'sub' => $user->id,
      'name' => $user->name,
      'email' => $user->email,
    ]);

    // Return response with token
    return response()->json([
      'message' => 'User registered successfully',
      'user' => $user,
      'token' => $token,
    ], 201);
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
