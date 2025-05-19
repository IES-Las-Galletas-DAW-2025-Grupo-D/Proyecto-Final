<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      $projects = Project::all();
      $users = User::all();
      $userIds = $users->pluck('id')->toArray();
      
      foreach ($projects as $project) {
         
        $numEvents = rand(2, 5);
        
        for ($i = 0; $i < $numEvents; $i++) {
          // Possible users for permissions (excluding the creator)
          $potentialUsers = array_diff($userIds, [$project->user_id]);
          
          // Randomly select 0-2 users for permissions
          $writePermissions = [];
          if (!empty($potentialUsers)) {
            $numPermissions = rand(0, min(2, count($potentialUsers)));
            $writePermissions = array_slice($potentialUsers, 0, $numPermissions);
          }
          
          Event::create([
            'name' => 'Event ' . ($i + 1) . ' of project ' . $project->name,
            'content' => "# Example Event\n\nThis is **markdown** content for event " . ($i + 1) . 
                   ".\n\n- Point 1\n- Point 2\n\nCreated for project: " . $project->name,
            'user_id' => $project->user_id,
            'project_id' => $project->id,
            'write_permissions' => $writePermissions,
          ]);
        }
      }
    }
}