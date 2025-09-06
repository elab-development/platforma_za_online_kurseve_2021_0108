<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CertificateController extends Controller
{
   // vraca sve sertifikate korisnika
    public function index(User $user)
    {
        $certs = Certificate::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->get(['id', 'user_id', 'course_id', 'certificate', 'created_at']);

        return response()->json(['data' => $certs]);
    }

    
    public function upload(Request $request)
    {
        $request->validate([
            'course_id'   => ['required', 'integer', 'exists:courses,id'],
            'certificate' => ['nullable', 'string', 'max:255'],
        ]);

        $userId          = Auth::id();
        $courseId        = (int) $request->input('course_id');
        $certificateText = $request->input('certificate', 'Sertifikat');

        $cert = Certificate::firstOrCreate(
            ['user_id' => $userId, 'course_id' => $courseId],
            ['certificate' => $certificateText]
        );

        return response()->json(['data' => $cert], $cert->wasRecentlyCreated ? 201 : 200);
    }
}
