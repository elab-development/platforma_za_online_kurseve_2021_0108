<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CertificateController extends Controller
{
    /**
     * GET /api/users/{user}/certificates
     * Vraća sve sertifikate datog korisnika (JSON).
     */
    public function index(User $user)
    {
        $certs = Certificate::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->get(['id', 'user_id', 'course_id', 'certificate', 'created_at']);

        return response()->json(['data' => $certs]);
    }

    /**
     * POST /api/certificates*  (sve tri rute iz routes api.php gađaju ovu metodu)
     * Minimalni upis “sertifikata” bez file upload-a.
     *
     * Očekuje:
     *  - course_id (required, exists:courses,id)
     *  - certificate (optional string; default: "Sertifikat")
     */
    public function upload(Request $request)
    {
        $request->validate([
            'course_id'   => ['required', 'integer', 'exists:courses,id'],
            'certificate' => ['nullable', 'string', 'max:255'],
        ]);

        $userId          = Auth::id();
        $courseId        = (int) $request->input('course_id');
        $certificateText = $request->input('certificate', 'Sertifikat');

        // Ne dupliraj isti sertifikat za (user, course) — vrati postojeći ili kreiraj novi
        $cert = Certificate::firstOrCreate(
            ['user_id' => $userId, 'course_id' => $courseId],
            ['certificate' => $certificateText]
        );

        return response()->json(['data' => $cert], $cert->wasRecentlyCreated ? 201 : 200);
    }
}
