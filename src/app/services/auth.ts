// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { user } from '@angular/fire/auth'; // Import the 'user' observable function

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Corrected: Use the 'user' observable function from @angular/fire/auth
  // Initialize it in the constructor to ensure 'this.auth' is ready.
  user$: Observable<User | null>;

  constructor(private auth: Auth) {
    // Assign the user$ observable here
    this.user$ = user(this.auth);
  }

  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  register(email: string, password: string): Observable<any> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }
}