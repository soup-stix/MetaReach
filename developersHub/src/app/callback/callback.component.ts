import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../service/auth-service.service';

@Component({
  selector: 'app-callback',
  template: '<p>Loading...</p>'
})
export class CallbackComponent implements OnInit {
  constructor(private route: ActivatedRoute, private githubAuthService: AuthService) {}

  ngOnInit(): void {
    // this.route.queryParams.subscribe(params => {
    //   const code = params['code'];
    //   if (code) {
    //     this.githubAuthService.handleGitHubCallback(code)
    //       .then(response => {
    //         console.log('Token:', response);
    //       })
    //       .catch(error => {
    //         console.error('Failed to exchange code for token:', error);
    //       });
    //   } else {
    //     console.error('No code received.');
    //   }
    // });
  }
}