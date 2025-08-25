<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'title'       => $this->title,
            'description' => $this->description,

            
            'teacher' => $this->whenLoaded('teacher', function () {
                return [
                    'id'   => $this->teacher->id,
                    'name' => $this->teacher->name,
                ];
            }),

            
            'students_enrolled_count' => $this->whenLoaded('enrollments', fn () => $this->enrollments->count()),

            'created_at' => optional($this->created_at)->format('Y-m-d'),
        ];
    }
}
