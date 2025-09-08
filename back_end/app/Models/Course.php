<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'teacher_id'];

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function create(User $user)
    {
        return $user->role === 'teacher';  // Samo korisnik koji je teacher moze da kreira i azurira kurseve
    }

    public function updateCourse(User $user, Course $course)
    {
        return $user->role === 'teacher';
    }
}

