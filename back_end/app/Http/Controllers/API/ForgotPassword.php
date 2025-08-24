<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;

class ForgotPasswordController extends Controller
{
    /**
     * GET /forgot-password
     * Samo informativno – front ionako pogađa POST endpoint.
     */
    public function getView(Request $request)
    {
        return response()->json([
            'message' => 'Za reset lozinke pošaljite POST /forgot-password sa { "email": "..." }'
        ]);
    }

    /**
     * POST /forgot-password
     * Prima { email } i šalje reset link (ako je email u bazi).
     */
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


