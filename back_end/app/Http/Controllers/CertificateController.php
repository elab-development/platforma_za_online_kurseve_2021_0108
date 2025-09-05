<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use App\Models\User;
use App\Models\Course;
use App\Models\Enrollment;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class CertificateController extends Controller
{
    public function index(User $user)
    {
        if (Auth::id() !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        return response()->json($user->certificates);
    }

    public function show(Certificate $certificate)
    {
        return response()->json([
            'id'              => $certificate->id,
            'user_id'         => $certificate->user_id,
            'course_id'       => $certificate->course_id,
            'certificate_url' => $certificate->certificate_url,
            'created_at'      => $certificate->created_at,
            'updated_at'      => $certificate->updated_at
        ]);
    }

   
    public function upload(Request $request)
    {
        $request->validate([
            'certificate' => 'nullable|string',
            'course_id'   => 'required|exists:courses,id',
        ]);

        $user = Auth::user();

        $url = $request->input('certificate');
        if (!$url || !is_string($url)) {
            $url = 'https://example.com/certificates/' . $user->id . '/' . $request->course_id . '/' . uniqid();
        }

       $certificate = Certificate::firstOrCreate(
    ['user_id' => $user->id, 'course_id' => $request->course_id],
    [
        'certificate_url' => $url,
        'file_path'       => "C:/sertifikati"
    ]
);


        return response()->json([
            'message'     => 'Sertifikat je evidentiran.',
            'certificate' => $certificate
        ], 201);
    }

 
    public function store(Request $request)
    {
        return $this->upload($request);
    }
}






