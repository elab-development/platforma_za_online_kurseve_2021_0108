<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Gate;
use App\Models\Course;
use App\Policies\CoursePolicy;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */


    public function boot()
    {
        ResetPassword::createUrlUsing(function ($user, string $token) {
            return url(route('password.reset', ['token' => $token, 'email' => $user->email], false));
        });
        Gate::define('enroll', [\App\Policies\CoursePolicy::class, 'enroll']);

    }

    protected $policies = [
        Course::class => CoursePolicy::class,
        Video::class => VideoPolicy::class,
        User::class => UserPolicy::class,
        Course::class => CoursePolicy::class
    ];

}
