import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  getGithubLoginUrl(): string {
    return environment.apiUrl+"auth/github?action=signin";  
  }

  getGithubSignUpUrl(): string {
    return environment.apiUrl+"auth/github?action=signup";  
  }

}
