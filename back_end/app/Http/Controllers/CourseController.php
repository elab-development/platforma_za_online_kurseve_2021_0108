<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache; 

class CourseController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->query('per_page', 8);
        $page    = (int) $request->query('page', 1);

        
        $cacheKey = "courses_page_{$page}_per_{$perPage}";        // kesiranje podataka

        $courses = Cache::remember($cacheKey, 60, function () use ($perPage, $page) {
            return Course::query()
                ->with(['teacher', 'enrollments'])      // ucitava podatke o nastavniku i ucitava sve prijave studenta na kurs
                ->orderByDesc('created_at')
                ->paginate($perPage, ['*'], 'page', $page);
        });

        $mapped = $courses->getCollection()->map(function ($c) {  //mapped sluzi da mi dobijemo podatke u formatu u kom zelimo na frontendu
            return [
                'id'          => $c->id,
                'title'       => $c->title,
                'description' => $c->description,
                'teacher'     => $c->teacher ? [
                    'id'   => $c->teacher->id,
                    'name' => $c->teacher->name,
                ] : null,
                'students_enrolled_count' => $c->enrollments ? $c->enrollments->count() : 0,
                'created_at'  => optional($c->created_at)->format('Y-m-d'),
            ];
        });

        $courses->setCollection($mapped);

        return response()->json($courses)->setStatusCode(200);
    }

    public function store(Request $request): JsonResponse  //upisuje se novi kurs u bazu
    {
        $validatedData = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'teacher_id'  => 'required|exists:users,id',
        ]);

        $course = new Course($validatedData);
        $course->save();

        Cache::flush(); 

        return response()->json([
            'message' => 'Course created successfully',
            'course'  => $course,
        ], 201);
    }

    public function show(Course $course): JsonResponse
    {
        $course->load(['teacher', 'enrollments']);

        $payload = [
            'id'          => $course->id,
            'title'       => $course->title,
            'description' => $course->description,
            'teacher'     => $course->teacher ? [
                'id'   => $course->teacher->id,
                'name' => $course->teacher->name,
            ] : null,
            'students_enrolled_count' => $course->enrollments ? $course->enrollments->count() : 0,
            'created_at'  => optional($course->created_at)->format('Y-m-d'),
        ];

        return response()->json(['data' => $payload], 200);
    }

    public function update(Request $request, Course $course): JsonResponse
    {
        $validatedData = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $course->update($validatedData);

        Cache::flush();

        return response()->json([
            'message' => 'Course updated successfully',
            'course'  => $course,
        ], 200);
    }

    public function destroy(Course $course): JsonResponse
    {
        $course->delete();

        Cache::flush(); 

        return response()->json(['message' => 'Course deleted']);
    }
}
