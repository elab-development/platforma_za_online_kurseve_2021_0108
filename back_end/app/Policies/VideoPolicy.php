<?php

namespace App\Policies;

use Illuminate\Auth\Access\Response;
use App\Models\Video;
use App\Models\User;
use App\Models\Course;

class VideoPolicy
{
   
    public function viewAny(User $user): bool
    {
        return false;
    }

  
    public function view(User $user, Video $video): bool
    {
        return false;
    }


    public function create(User $user, Course $course)
    {
        // Dozvoljeno samo nastavnicima i samo ako su vlasnici kursa
        return $user->role === 'teacher' && $user->id === $course->teacher_id;
    }
    
    
    public function update(User $user, Video $video): bool
    {
        return false;
    }

    public function delete(User $user, Video $video): bool
    {
        return false;
    }

    public function restore(User $user, Video $video): bool
    {
        return false;
    }

    public function forceDelete(User $user, Video $video): bool
    {
        return false;
    }
    public function uploadVideo(User $user, Video $video)
    {
        return $user->role === 'teacher';
    }
}
