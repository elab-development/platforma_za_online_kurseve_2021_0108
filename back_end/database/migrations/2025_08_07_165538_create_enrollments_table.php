<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->cascadeOnDelete();          // NOT NULL + FK
            $table->foreignId('course_id')
                  ->constrained('courses')
                  ->cascadeOnDelete();          // NOT NULL + FK
            $table->timestamps();

            // Spreči duplu prijavu istog korisnika na isti kurs
            $table->unique(['user_id', 'course_id']);
        });
    }

    public function down() {
        Schema::dropIfExists('enrollments');
    }
};
