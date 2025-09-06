<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:50', 'unique:users,name'],
            'email'    => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'role'     => ['nullable', 'string', Rule::in(['student', 'teacher', 'admin'])],
        ]);

        $user = new User();
        $user->name     = $validated['name'];
        $user->email    = $validated['email'];
        $user->role     = $validated['role'] ?? 'student';
        $user->password = Hash::make($validated['password']);
        $user->save();

        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully.',
            'user'    => $user,
            'token'   => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $input = $request->input('login')
              ?? $request->input('email')
              ?? $request->input('name')
              ?? $request->input('username');

        if (!$input) {
            return response()->json(['message' => 'Login field (login/email/name/username) is required.'], 422);
        }

        $inputTrimmed = trim($input);

        $user = User::where('email', strtolower($inputTrimmed))->first()
             ?? User::where('name', $inputTrimmed)->first()
             ?? (User::where('username', $inputTrimmed)->first() ?? null);

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials.'], 401);
        }

        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'message' => 'Login successful.',
            'user'    => $user,
            'token'   => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()?->currentAccessToken()?->delete();
        return response()->json(['message' => 'Logged out.']);
    }

    public function resetPasswordSimple(Request $request)
    {
        $validated = $request->validate([
            'email'                 => ['required', 'email', 'exists:users,email'],
            'password'              => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        $email = strtolower(trim($validated['email']));
        $user = User::where('email', $email)->firstOrFail();

        $user->password = Hash::make($validated['password']);
        $user->save();

        $user->tokens()->delete();

        return response()->json([
            'message' => 'Lozinka je uspešno promenjena. Sada se prijavite novom lozinkom.'
        ]);
    }
}

