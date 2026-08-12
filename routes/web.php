<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('branches', \App\Http\Controllers\BranchController::class);
    Route::resource('users', \App\Http\Controllers\UserController::class);
});

require __DIR__.'/settings.php';
