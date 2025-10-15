import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// ← fichiers à la racine de src/app
import { RegisterRequest } from './register-request';
import { AuthResponse } from './auth-response';
import { UserDto } from './user-dto';

// url de mon bakend
const HOST = 'http://localhost:8080';
// url genre par /api/users
const API_BASE = `${HOST}/api`;

// Préfixe REST commun
const API  = `${HOST}/api`;
// /auth/register, /auth/login
//const AUTH_BASE = `${HOST}/auth`;

// Routes d’authentification (→ /api/auth/...)
const AUTH = `${API}/auth`;

@Injectable({ providedIn: 'root' })
export class UserApiService {
  // resources utilisateurs 
  private readonly usersUrl = `${API_BASE}/users`;

  constructor(private http: HttpClient) {}

  // pour l'inscription POST  /api/auth/register
 // register(payload: RegisterRequest): Observable<AuthResponse> {
   // return this.http.post<AuthResponse>(`${AUTH_BASE}/register`, payload);
 // }
 register(payload: RegisterRequest): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${AUTH}/register`, payload);
}

 // connexion 
  //login(identifier: string, password: string): Observable<AuthResponse> {
   // return this.http.post<AuthResponse>(`${AUTH_BASE}/login`, { identifier, password });
 // }
 login(identifier: string, password: string): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${AUTH}/login`, { identifier, password });
}

  // pour recuperer ts les utilisateurs 
  getAll(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(this.usersUrl, { headers: this.authHeaders() });
  }

  // pour supprimer un utilisateur par son id 
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.usersUrl}/${id}`, { headers: this.authHeaders() });
  }

  // l'authorization en lien avec le token
  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }
}
