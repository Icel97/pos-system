<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'phone',
        'is_warehouse',
        'is_active',
    ];

    protected $casts = [
        'is_warehouse' => 'boolean',
        'is_active' => 'boolean',
    ];
}
