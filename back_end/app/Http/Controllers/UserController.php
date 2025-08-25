<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
  
    public function index()
    {
        $users = User::query()
            ->select('id', 'name', 'email', 'role')
            ->whereIn('role', ['student', 'teacher'])
            ->orderBy('role')
            ->orderBy('name')
            ->get();

        return response()->json(['data' => $users]);
    }

    
    public function show(User $user)
    {
        return response()->json($user);
    }

 
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name'  => ['sometimes','string','max:50'],
            'email' => ['sometimes','email','max:255','unique:users,email,'.$user->id],
            'role'  => ['sometimes','in:student,teacher,admin'],
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'User updated successfully.',
            'user'    => $user,
        ]);
    }

  
    public function destroy(User $user)
    {
        $user->tokens()?->delete();
        $user->delete();

        return response()->json(['message' => 'User deleted successfully.']);
    }
}


