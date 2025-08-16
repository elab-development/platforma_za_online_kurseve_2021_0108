<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        api: __DIR__.'/../routes/api.php',
        apiPrefix: 'api',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
         $exceptions->render(function (Throwable $e, $request) {
        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => $e->getMessage(),
            ], method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 400);
        }
    });
    })->create();
