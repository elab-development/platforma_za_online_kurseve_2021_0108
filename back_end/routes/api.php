<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\VideoController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\CertificateController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\API\ForgotPasswordController;
use App\Http\Controllers\API\ResetPasswordController;
// 🔐 Autentifikacija
Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

Route::get('/forgot-password', [ForgotPasswordController::class,'getView'])->middleware('guest')->name('password.request');

Route::post('/forgot-password',[ForgotPasswordController::class,'sendResetLink']);

Route::get('/reset-password/{token}', [ResetPasswordController::class,'getView'])->middleware('guest')->name('password.reset');
 
Route::post('/reset-password', [ResetPasswordController::class, 'reset']);


// 🛡️ Zaštitimo rute da im mogu pristupiti samo prijavljeni korisnici
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // 📚 Kursevi
    Route::get('/courses', [CourseController::class, 'index']); // Prikaz svih kurseva
    Route::get('/courses/{course}', [CourseController::class, 'show']); // Prikaz jednog kursa
    Route::post('/courses', [CourseController::class, 'store'])->middleware('can:create,App\Models\Course'); // Kreiranje kursa (samo nastavnici)
    Route::put('/courses/{course}', [CourseController::class, 'update'])->middleware('can:updateCourse,course'); // Ažuriranje kursa (samo nastavnici)
    Route::delete('/courses/{course}', [CourseController::class, 'destroy'])->middleware('can:delete,App\Models\Course'); // Brisanje kursa (samo nastavnici)

    // 🎥 Video lekcije
    Route::get('/courses/{course}/videos', [VideoController::class, 'index']);
    Route::get('/courses/{course}/videos/{video}', [VideoController::class, 'show']);
    Route::post('/courses/{course}/videos', [VideoController::class, 'store'])->middleware('can:create,App\Models\Video,course');    
    // 📝 Prijave na kurs (samo studenti mogu)
    Route::post('/courses/{course}/enroll', [EnrollmentController::class, 'store'])->middleware('can:enroll,course');

    // 🏆 Sertifikati
    Route::get('/users/{user}/certificates', [CertificateController::class, 'index']);
    Route::get('/certificates/{certificate}', [CertificateController::class, 'show']);

    // 👥 Korisnici
    Route::get('/users', [UserController::class, 'index'])->middleware('can:viewAny,App\Models\User'); // Svi korisnici (admin)
    Route::get('/users/{user}', [UserController::class, 'show']); // Prikaz pojedinačnog korisnika
    Route::put('/users/{user}', [UserController::class, 'update'])->middleware('can:update,user'); // Ažuriranje profila
    Route::get('/users/{user}/courses/enrolled', [UserController::class, 'enrolledCourses']); // Kursevi koje pohađa
    Route::get('/users/{user}/courses/teaching', [UserController::class, 'teachingCourses']); // Kursevi koje predaje
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->middleware('can:delete,user');
    Route::post('/courses/{course}/videos/upload', [VideoController::class, 'upload'])->middleware('can:create,App\Models\Video'); // ✅ Samo nastavnik može
    
    // 📂 Upload sertifikata (samo admin može)
    Route::post('/certificates/upload', [CertificateController::class, 'upload'])->middleware('can:create,App\Models\Certificate');

    // 📄 Download/export sertifikata
    Route::get('/certificates/{certificate}/download', [CertificateController::class, 'export']);


    Route::middleware('auth:sanctum')->group(function () {
    Route::get('/courses/{course}/certificate', [CertificateController::class, 'generateCertificate']);
    });

});