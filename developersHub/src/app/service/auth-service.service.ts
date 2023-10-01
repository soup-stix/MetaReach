import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private githubClientId = 'd020d5881a5ee1ad50e8';
  private githubRedirectUri = 'http://localhost:4200/profile/soup-stix';

  constructor(private http: HttpClient) {}

  getGithubLoginUrl(): string {
    return `http://localhost:3000/auth/github`;  
  }

  handleGitHubCallback(code: string): Promise<any> {
    const url = 'http://localhost:3000/auth/github/callback';
    return this.http.post<any>(url, { code }).toPromise();
  }
}
