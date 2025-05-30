<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
  /**
   * Run the database seeds.
   *
   * @return void
   */
  public function run()
  {
    User::create([
      'name' => 'admin',
      'email' => 'admin@example.com',
      'password' => Hash::make('password'),
    ]);

    User::create([
      'name' => 'user1',
      'email' => 'user1@example.com',
      'password' => Hash::make('password'),
    ]);

    User::create([
      'name' => 'testuser',
      'email' => 'test@example.com',
      'password' => '12345678aA@',
    ]);
  }
}
