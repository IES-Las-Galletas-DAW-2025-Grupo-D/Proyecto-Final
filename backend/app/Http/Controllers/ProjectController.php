<?php


namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $user = Auth::user();
        $userId = $user->id;

        $projects = Project::where('user_id', $userId)
            ->orWhereRaw("JSON_CONTAINS(write_permissions, CAST(? AS JSON))", [$userId])
            ->orWhereRaw("JSON_CONTAINS(read_permissions, CAST(? AS JSON))", [$userId])
            ->orderBy('created_at', 'desc')
            ->paginate(6);

        return response()->json($projects);
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
            'description' => 'nullable|string',
            'write_permissions' => 'nullable|array',
            'write_permissions.*' => 'exists:users,id',
            'read_permissions' => 'nullable|array',
            'read_permissions.*' => 'exists:users,id'
        ]);

        $project = new Project([
            'name' => $request->name,
            'description' => $request->description,
            'user_id' => Auth::id(),
            'write_permissions' => $request->write_permissions ?? [],
            'read_permissions' => $request->read_permissions ?? [],
        ]);

        $project->save();

        return response()->json($project, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $project = Project::findOrFail($id);
        $userId = Auth::id();

        // Check if user has permission to view the project
        if (!$project->userCanRead($userId)) {
            return response()->json(['error' => 'Unauthorized to view this project'], 403);
        }

        return response()->json($project);
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
        $project = Project::findOrFail($id);
        $userId = Auth::id();

        // Check if user has permission to update the project
        if (!$project->userCanWrite($userId)) {
            return response()->json(['error' => 'Unauthorized to update this project'], 403);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
        ]);

        if ($request->has('name')) {
            $project->name = $request->name;
        }

        if ($request->has('description')) {
            $project->description = $request->description;
        }

        $project->save();

        return response()->json($project);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $project = Project::findOrFail($id);

        // Only the creator can delete the project
        if ($project->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized to delete this project'], 403);
        }

        $project->delete();

        return response()->json(['message' => 'Project deleted successfully']);
    }

    /**
     * Get all events for a specific project.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function events($id)
    {
        $project = Project::findOrFail($id);
        $userId = Auth::id();

        // Check if user has permission to view the project's events
        if (!$project->userCanRead($userId)) {
            return response()->json(['error' => 'Unauthorized to view this project\'s events'], 403);
        }

        return response()->json($project->events);
    }

    /**
     * Add a user to project write permissions
     * 
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function addWritePermission(Request $request, $id)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $project = Project::findOrFail($id);

        // Only the creator can add write permissions
        if ($project->user_id !== Auth::id()) {
            return response()->json(['error' => 'Only the creator can manage write permissions'], 403);
        }

        $project->addWritePermission($request->user_id);

        // If user has write permission, they also should have read permission
        $project->addReadPermission($request->user_id);

        return response()->json(['message' => 'Write permission added successfully']);
    }

    /**
     * Remove a user from project write permissions
     * 
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function removeWritePermission(Request $request, $id)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $project = Project::findOrFail($id);

        // Only the creator can remove write permissions
        if ($project->user_id !== Auth::id()) {
            return response()->json(['error' => 'Only the creator can manage write permissions'], 403);
        }

        $project->removeWritePermission($request->user_id);

        return response()->json(['message' => 'Write permission removed successfully']);
    }

    /**
     * Add a user to project read permissions
     * 
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function addReadPermission(Request $request, $id)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $project = Project::findOrFail($id);

        // Only the creator can add read permissions
        if ($project->user_id !== Auth::id()) {
            return response()->json(['error' => 'Only the creator can manage read permissions'], 403);
        }

        $project->addReadPermission($request->user_id);

        return response()->json(['message' => 'Read permission added successfully']);
    }

    /**
     * Remove a user from project read permissions
     * 
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function removeReadPermission(Request $request, $id)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $project = Project::findOrFail($id);

        // Only the creator can remove read permissions
        if ($project->user_id !== Auth::id()) {
            return response()->json(['error' => 'Only the creator can manage read permissions'], 403);
        }

        // If user has write permission, remove it first
        if (in_array($request->user_id, $project->write_permissions ?? [])) {
            $project->removeWritePermission($request->user_id);
        }

        $project->removeReadPermission($request->user_id);

        return response()->json(['message' => 'Read permission removed successfully']);
    }
}
