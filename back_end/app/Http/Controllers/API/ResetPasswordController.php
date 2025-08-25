<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class ResetPasswordController extends Controller
{
 
    public function getView(Request $request, string $token)
    {
        return response()->json([
            'message' => 'Pošaljite POST /reset-password sa { token, email, password, password_confirmation }',
            'token'   => $token,
        ]);
    }

 
    public function reset(Request $request)
    {
        $request->validate([
            'token'                 => ['required'],
            'email'                 => ['required', 'email'],
            'password'              => ['required', 'confirmed', 'min:6'],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user) use ($request) {
                $user->forceFill([
                    'password' => Hash::make($request->password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'message' => 'Lozinka je uspešno resetovana. Sada se možete prijaviti novom lozinkom.',
                'status'  => __($status),
            ]);
        }

        return response()->json([
            'message' => 'Reset lozinke nije uspeo.',
            'status'  => __($status),
        ], 400);
    }
}



