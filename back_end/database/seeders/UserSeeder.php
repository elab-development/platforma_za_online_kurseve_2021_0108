<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        User::factory(5)->create(['role' => 'student']);
        User::factory(3)->create(['role' => 'teacher']);
        User::factory(1)->create(['role' => 'admin']);
    }
}
