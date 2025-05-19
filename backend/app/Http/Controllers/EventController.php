<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $user = Auth::user();
        $events = Event::where('user_id', $user->id)
            ->orWhereRaw("JSON_CONTAINS(write_permissions, ?)", [$user->id])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($events);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'content' => 'required|string',
            'project_id' => 'required|exists:projects,id',
            'write_permissions' => 'nullable|array',
            'write_permissions.*' => 'exists:users,id'
        ]);

        // Check if user has access to the project
        $project = Project::findOrFail($request->project_id);
        if ($project->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized to create events in this project'], 403);
        }

        $event = new Event([
            'name' => $request->name,
            'content' => $request->content,
            'user_id' => Auth::id(),
            'project_id' => $request->project_id,
            'write_permissions' => $request->write_permissions ?? [],
        ]);

        $event->save();

        return response()->json($event, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $event = Event::findOrFail($id);
        $userId = Auth::id();

        // Check if user has permission to view the event
        if ($event->user_id !== $userId && !$event->userCanWrite($userId)) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json($event);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);
        $userId = Auth::id();

        // Check if user has permission to update the event
        if (!$event->userCanWrite($userId)) {
            return response()->json(['error' => 'Unauthorized to update this event'], 403);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
        ]);

        if ($request->has('name')) {
            $event->name = $request->name;
        }

        if ($request->has('content')) {
            $event->content = $request->content;
        }

        $event->save();

        return response()->json($event);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $event = Event::findOrFail($id);

        // Only the creator can delete an event
        if ($event->user_id !== Auth::id()) {
            return response()->json(['error' => 'Only the creator can delete this event'], 403);
        }

        $event->delete();

        return response()->json(['message' => 'Event deleted successfully']);
    }

    /**
     * Add a user to event write permissions
     * 
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function addPermission(Request $request, $id)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $event = Event::findOrFail($id);

        // Only the creator can add permissions
        if ($event->user_id !== Auth::id()) {
            return response()->json(['error' => 'Only the creator can manage permissions'], 403);
        }

        $event->addWritePermission($request->user_id);

        return response()->json(['message' => 'Permission added successfully']);
    }

    /**
     * Remove a user from event write permissions
     * 
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function removePermission(Request $request, $id)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $event = Event::findOrFail($id);

        // Only the creator can remove permissions
        if ($event->user_id !== Auth::id()) {
            return response()->json(['error' => 'Only the creator can manage permissions'], 403);
        }

        $event->removeWritePermission($request->user_id);

        return response()->json(['message' => 'Permission removed successfully']);
    }
}
