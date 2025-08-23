<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

class UserPolicy
{
    // Da li korisnik moze da vidi bilo koji model

    public function viewAny(User $user)
{
    return $user->role === 'admin'; // Samo admin može videti sve korisnike
}


    public function view(User $user, User $model): bool
    {
        return false;
    }

  
    public function create(User $user): bool
    {
        return false;
    }

   
    public function update(User $authUser, User $user): bool
{
    return $authUser->id === $user->id || $authUser->role === 'admin';
}


   
    public function delete(User $user, User $model): bool 
{
    return $user->role === 'admin';
}

    
    


   
    public function restore(User $user, User $model): bool
    {
        return false;
    }

   
    public function forceDelete(User $user, User $model): bool
    {
        return false;
    }
}