<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CertificateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'student'         => new UserResource($this->whenLoaded('user')),
            'course'          => new CourseResource($this->whenLoaded('course')),
            'certificate_url' => $this->certificate_url,
            'issued_at'       => optional($this->created_at)->format('Y-m-d'),
        ];
    }
}

