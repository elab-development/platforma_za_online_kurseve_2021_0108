<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\CertificateController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\API\ForgotPasswordController;
use App\Http\Controllers\API\ResetPasswordController;
use App\Http\Controllers\ExternalController;

// Autentifikacija
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// reset lozinke
Route::post('/reset-password-simple', [AuthController::class, 'resetPasswordSimple']);
Route::get('/forgot-password', [ForgotPasswordController::class,'getView'])->middleware('guest')->name('password.request');
Route::post('/forgot-password',[ForgotPasswordController::class,'sendResetLink']);
Route::get('/reset-password/{token}', [ResetPasswordController::class,'getView'])->middleware('guest')->name('password.reset');
Route::post('/reset-password', [ResetPasswordController::class, 'reset']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Kursevi 
    Route::get('/courses', [CourseController::class, 'index']);
    Route::get('/courses/{course}', [CourseController::class, 'show']);
    Route::post('/courses', [CourseController::class, 'store'])->middleware('can:create,App\Models\Course');
    Route::delete('/courses/{course}', [CourseController::class, 'destroy'])->middleware('can:delete,course');

    //  Resource ruta za prijave na kurs
    Route::apiResource('courses.enrollments', EnrollmentController::class)
        ->only(['store'])
        ->middleware('can:enroll,course');

    //  Sertifikati
    Route::get('/users/{user}/certificates', [CertificateController::class, 'index']);
    Route::post('/certificates/store', [CertificateController::class, 'upload']);       // front-end gađa ovo
    Route::post('/certificates',       [CertificateController::class, 'upload']);       // fallback
    Route::post('/certificates/issue-on-view', [CertificateController::class, 'upload']); // čitljiv alias

    // Prijave na kurs
    Route::post('/courses/{course}/enroll', [EnrollmentController::class, 'store'])->middleware('can:enroll,course');

    // Korisnici
    Route::get('/users', [UserController::class, 'index'])->middleware('can:viewAny,App\Models\User');
    Route::get('/users/{user}', [UserController::class, 'show']);
    Route::put('/users/{user}', [UserController::class, 'update'])->middleware('can:update,user');
    Route::get('/users/{user}/courses/enrolled', [UserController::class, 'enrolledCourses']);
    Route::get('/users/{user}/courses/teaching', [UserController::class, 'teachingCourses']);
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->middleware('can:delete,user');

    // Javni servis — motivaciona poruka (Dashboard)
    Route::get('/external/quote', [ExternalController::class, 'quote']);
});



