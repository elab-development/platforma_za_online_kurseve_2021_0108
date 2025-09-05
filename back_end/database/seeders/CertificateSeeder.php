<?php

namespace Database\Seeders;

use App\Models\Certificate;
use Illuminate\Database\Seeder;

class CertificateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Certificate::factory(5)->create(); // Samo nekim studentima dodeliti sertifikate
    }
}
