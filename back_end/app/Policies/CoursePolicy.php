<?php

namespace App\Policies;

use Illuminate\Auth\Access\Response;
use App\Models\Course;
use App\Models\User;

class CoursePolicy
{
    // Da li korisnik moze da vidi bilo koji model
     
    public function viewAny(User $user): bool
    {
        return false;
    }

    //Da li korisnik moze da vidi odredjeni model

    public function view(User $user, Course $course): bool
    {
        return false;
    }

    //Da li korisnik moze da kreira model

    public function create(User $user): bool
    {
        return $user->role === 'teacher';
    }
    
    //Da li korisnik moze da azurira model
    public function updateCourse(User $user, Course $course)
{
    return $user->id === $course->teacher_id; // ✅ Primer provere da li je nastavnik vlasnik kursa
}

    //Da li korisnik moze da brise model

    public function delete(User $user, Course $course): bool
    {
        return $user->id === $course->teacher_id;
    }

    //Da li korisnik moze da vrati model

    public function restore(User $user, Course $course): bool
    {
        return false;
    }

     //Da li korisnik moze trajno da obrise model
     
    public function forceDelete(User $user, Course $course): bool
    {
        return false;
    }
    public function enroll(User $user, Course $course)
    {
        return $user->role === 'student';
    }

    public function uploadVideo(User $user, Course $course)
    {   
        return $user->role === 'teacher' && $user->id === $course->teacher_id;
    }
}
