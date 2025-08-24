<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use App\Http\Resources\CourseResource;

class CourseController extends Controller
{
    public function index()
    {
        return CourseResource::collection(
            Course::with(['teacher', 'videos', 'enrollments'])->get()
        );
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'teacher_id' => 'required|exists:users,id'
        ]);

        $course = new Course($validatedData);
        $course->save();

        return response()->json([
            'message' => 'Course created successfully',
            'course'  => $course
        ], 201);
    }

    public function show(Course $course)
    {
        return new CourseResource(
            $course->load(['teacher', 'videos', 'enrollments'])
        );
    }

    public function update(Request $request, Course $course)
    {
        $validatedData = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $course->update($validatedData);

        return response()->json([
            'message' => 'Course updated successfully',
            'course'  => $course
        ], 200);
    }

    /**
     * Brisanje kursa:
     * - Dozvoljeno SAMO nastavniku koji je vlasnik kursa (teacher_id = auth user id).
     * - Pre brisanja kursa brišu se povezani videos i enrollments (radi FK ograničenja).
     */
    public function destroy(Request $request, Course $course)
    {
        $user = $request->user();

        // 1) Provera autentikacije i uloge
        if (!$user || $user->role !== 'teacher') {
            return response()->json(['message' => 'Nemate dozvolu da obrišete ovaj kurs.'], 403);
        }

        // 2) Provera vlasništva nad kursom (nastavnik koji je kreirao kurs)
        if ((int) $course->teacher_id !== (int) $user->id) {
            return response()->json(['message' => 'Možete obrisati samo svoje kurseve.'], 403);
        }

        // 3) Brisanje povezanih zapisa (ako postoje relacije hasMany)
        //    Napomena: u tvom kontroleru se već load-uje 'videos' i 'enrollments',
        //    pa pretpostavljamo da Course model ima:
        //      - public function videos() { return $this->hasMany(Video::class); }
        //      - public function enrollments() { return $this->hasMany(Enrollment::class); }
        if (method_exists($course, 'videos')) {
            $course->videos()->delete();
        }
        if (method_exists($course, 'enrollments')) {
            $course->enrollments()->delete();
        }

        // 4) Brisanje samog kursa
        $course->delete();

        return response()->json(['message' => 'Course deleted']);
    }
}
