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
}
