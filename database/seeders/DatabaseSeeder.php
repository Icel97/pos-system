<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        $this->call([RoleSeeder::class]);

        $branch = \App\Models\Branch::firstOrCreate(
            ['id' => 1],
            ['name' => 'Matriz', 'is_active' => true, 'is_warehouse' => false]
        );

        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('Admin123'),
            'branch_id' => 1,
        ]);

        $user->assignRole('Admin');
    }
}
