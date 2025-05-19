<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model
{
  use HasFactory, SoftDeletes;

  /**
   * The attributes that are mass assignable.
   *
   * @var array<int, string>
   */
  protected $fillable = [
    'name',
    'content',
    'user_id',
    'project_id',
    'write_permissions',
  ];

  /**
   * The attributes that should be cast.
   *
   * @var array<string, string>
   */
  protected $casts = [
    'write_permissions' => 'array',
    'created_at' => 'datetime',
    'updated_at' => 'datetime',
    'deleted_at' => 'datetime',
  ];

  /**
   * The attributes that should be hidden for serialization.
   *
   * @var array<int, string>
   */
  protected $hidden = [
    'write_permissions',
  ];

  /**
   * Get the user that created the event.
   */
  public function user()
  {
    return $this->belongsTo(User::class);
  }

  /**
   * Get the project that owns the event.
   */
  public function project()
  {
    return $this->belongsTo(Project::class);
  }

  /**
   * Check if a user has write permission for this event.
   *
   * @param int $userId
   * @return bool
   */
  public function userCanWrite($userId)
  {
    // The creator always has write permissions
    if ($this->user_id == $userId) {
      return true;
    }

    // Check if the user ID is in the write_permissions array
    return in_array($userId, $this->write_permissions ?? []);
  }

  /**
   * Add a user to the write permissions list.
   *
   * @param int $userId
   * @return void
   */
  public function addWritePermission($userId)
  {
    $permissions = $this->write_permissions ?? [];

    if (!in_array($userId, $permissions)) {
      $permissions[] = $userId;
      $this->write_permissions = $permissions;
      $this->save();
    }
  }

  /**
   * Remove a user from the write permissions list.
   *
   * @param int $userId
   * @return void
   */
  public function removeWritePermission($userId)
  {
    if (!$this->write_permissions) {
      return;
    }

    $this->write_permissions = array_filter($this->write_permissions, function ($id) use ($userId) {
      return $id != $userId;
    });

    $this->save();
  }
}
