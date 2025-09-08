<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {                                     // kreira tabelu
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->enum('role', ['student', 'teacher', 'admin'])->default('student');
            $table->timestamps(); // kreira kolone created_at i updated_at
        });
    }

    public function down() {
        Schema::dropIfExists('users');                   //brise tabelu
    }
};