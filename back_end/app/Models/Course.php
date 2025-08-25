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

    // ❌ uklonjeno:
    // public function videos(): HasMany { ... }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    // (ostalo ostavljeno kako je bilo, iako logika dozvola obično ide u Policy)
    public function create(User $user)
    {
        return $user->role === 'teacher';
    }

    public function updateCourse(User $user, Course $course)
    {
        return $user->role === 'teacher';
    }
}

