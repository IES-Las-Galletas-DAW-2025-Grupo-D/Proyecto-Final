<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
  use HasFactory, SoftDeletes;

  /**
   * The attributes that are mass assignable.
   *
   * @var array<int, string>
   */
  protected $fillable = [
    'name',
    'description',
    'user_id',
    'write_permissions',
    'read_permissions',
  ];

  /**
   * The attributes that should be cast.
   *
   * @var array<string, string>
   */
  protected $casts = [
    'created_at' => 'datetime',
    'updated_at' => 'datetime',
    'deleted_at' => 'datetime',
    'write_permissions' => 'array',
    'read_permissions' => 'array',
  ];

  /**
   * The attributes that should be hidden for serialization.
   *
   * @var array<int, string>
   */
  protected $hidden = [
    'write_permissions',
    'read_permissions',
  ];

  /**
   * Get the user that created the project.
   */
  public function user()
  {
    return $this->belongsTo(User::class);
  }

  /**
   * Get the events for the project.
   */
  public function events()
  {
    return $this->hasMany(Event::class);
  }

  /**
   * Check if a user has write permission for this project.
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
   * Check if a user has read permission for this project.
   *
   * @param int $userId
   * @return bool
   */
  public function userCanRead($userId)
  {
    // The creator always has read permissions
    if ($this->user_id == $userId) {
      return true;
    }

    // Users with write permission also have read permission
    if (in_array($userId, $this->write_permissions ?? [])) {
      return true;
    }

    // Check if the user ID is in the read_permissions array
    return in_array($userId, $this->read_permissions ?? []);
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
   * Add a user to the read permissions list.
   *
   * @param int $userId
   * @return void
   */
  public function addReadPermission($userId)
  {
    $permissions = $this->read_permissions ?? [];

    if (!in_array($userId, $permissions)) {
      $permissions[] = $userId;
      $this->read_permissions = $permissions;
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

  /**
   * Remove a user from the read permissions list.
   *
   * @param int $userId
   * @return void
   */
  public function removeReadPermission($userId)
  {
    if (!$this->read_permissions) {
      return;
    }

    $this->read_permissions = array_filter($this->read_permissions, function ($id) use ($userId) {
      return $id != $userId;
    });

    $this->save();
  }
}
