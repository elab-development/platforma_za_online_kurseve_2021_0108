<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Enrollment>
 */
class EnrollmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::where('role', 'student')->inRandomOrder()->first()->id ?? User::factory()->create(['role' => 'student'])->id,
            'course_id' => Course::inRandomOrder()->first()->id ?? Course::factory()->create()->id,
        ];
    }
}
