import { Component } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SignupComponent } from '../signup/signup.component';
import { DatabaseService } from '../service/database.service';
import { AuthService } from '../service/auth-service.service';
import { CacheService } from '../shared/cacheService';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { query } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [NgbCarouselConfig, DatabaseService],
})
export class HomeComponent {
    showNavigationArrows = false;
    showNavigationIndicators = false;
    images = [`https://picsum.photos/id/1055/900/500`, `https://img.freepik.com/free-vector/hand-drawn-web-developers_23-2148819604.jpg?size=626&ext=jpg`, `https://picsum.photos/id/194/900/500`];
    value = ''; 
	constructor(private route: ActivatedRoute, private _snackBar: MatSnackBar, private cache: CacheService, private authService: AuthService, config: NgbCarouselConfig, private modalService: NgbModal) {
		// customize default values of carousels used by this component tree
		config.showNavigationArrows = true;
		config.showNavigationIndicators = true;
	}

	  loginWithGithub(): void {
		window.location.href = this.authService.getGithubLoginUrl();
	  }

	  signupWithGithub(): void {
		window.location.href = this.authService.getGithubSignUpUrl();
	  }

	ngOnInit() {

		if (this.cache.getData() == null) {
			this.cache.setData({username: "guest", token: environment.token, jwt: ""})
		}
		else {
			// this.loginWithGithub()
		}
		console.log("cache data:", this.cache.getData());
	}

	open() {
		const modalRef = this.modalService.open(SignupComponent);
		modalRef.componentInstance.prefilled = {};
		modalRef.componentInstance.update = false;
	}
}
