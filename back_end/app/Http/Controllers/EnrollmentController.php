<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    public function store(Request $request, Course $course)
    {
        $user = $request->user(); 

     
        if ($user->role !== 'student') {
            return response()->json(['error' => 'Only students can enroll in courses'], 403);
        }

        
        $enrollment = $course->enrollments()->firstOrCreate([
            'user_id' => $user->id,
        ]);

        return response()->json([
            'message'    => 'Enrolled successfully!',
            'enrollment' => $enrollment,
        ], 201);
    }
}
