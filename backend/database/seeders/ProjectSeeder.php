<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
  /**
   * Run the database seeds.
   *
   * @return void
   */
  public function run()
  {
    $users = User::all();

    foreach ($users as $user) {
      // Create a random number of projects for each user
      $numProjects = rand(1, 3);

      for ($i = 0; $i < $numProjects; $i++) {
        Project::create([
          'name' => 'Project ' . ($i + 1) . ' de ' . $user->name,
          'description' => 'Sample description ' . ($i + 1) . ' created by ' . $user->name,
          'user_id' => $user->id,
        ]);
      }
    }
  }
}
