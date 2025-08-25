<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;

class ForgotPasswordController extends Controller
{
   
    public function getView(Request $request)
    {
        return response()->json([
            'message' => 'Za reset lozinke pošaljite POST /forgot-password sa { "email": "..." }'
        ]);
    }

    public function sendResetLink(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'message' => 'Link za reset lozinke je poslat na email.',
                'status'  => __($status),
            ]);
        }

        return response()->json([
            'message' => 'Nije moguće poslati link za reset lozinke.',
            'status'  => __($status),
        ], 400);
    }
}


