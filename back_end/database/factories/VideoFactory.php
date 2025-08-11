<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Video>
 */
class VideoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(4),
            'video_url' => 'https://example.com/' . $this->faker->uuid() . '.mp4',
            'course_id' => Course::inRandomOrder()->first()->id ?? Course::factory()->create()->id,
        ];
    }
}
