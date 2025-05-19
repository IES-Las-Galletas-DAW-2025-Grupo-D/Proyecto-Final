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
        $projects = Project::where('user_id', Auth::id())->orderBy('created_at', 'desc')->get();
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
        ]);

        $project = new Project([
            'name' => $request->name,
            'description' => $request->description,
            'user_id' => Auth::id(),
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
        
        // Only the creator can view the project
        if ($project->user_id !== Auth::id()) {
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
        
        // Only the creator can update the project
        if ($project->user_id !== Auth::id()) {
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
        
        // Only the creator can view the project's events
        if ($project->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized to view this project\'s events'], 403);
        }

        return response()->json($project->events);
    }
}