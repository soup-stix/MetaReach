import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SignupComponent } from '../signup/signup.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddProjectComponent } from '../add-project/add-project.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';
import { CacheService } from '../shared/cacheService';
import { Router } from '@angular/router';


let httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  withCredentials: true 
};

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [HttpClient]
})
export class UserComponent {
  guest: boolean = false;
  user: string | undefined;
  repos: any;
  userData: any;
  allData: any;
  loggedIn: string = "guest";
  githubToken: any;
  private sub: any;
  projectOpenState: boolean = true;
  githubOpenState: boolean = true;
  headers: HttpHeaders | undefined;
  projects: any[] = [{title:"test", desc:"testing desc",stack:["test", "test", "test", "test", "test", "test", "test"]}];

  constructor(private router: Router, private cache: CacheService, public _snackBar: MatSnackBar, private route: ActivatedRoute, private http: HttpClient, private modalService: NgbModal) {}

  async ngOnInit() {

    const queryParams = this.route.snapshot.queryParamMap;
		let jwt = queryParams.get('jwt');
		console.log('Query param "jwt":', jwt);

    if (jwt) {
      httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`,
        }),
        withCredentials: true 
      };
    }
    else{
      if (this.cache.getData() != null){
        jwt = this.cache.getData().jwt;
      }
      else { jwt = ""}
      // jwt = this.cache.getData().jwt;
      httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`,
        }),
        withCredentials: true 
      };
    }


    console.log("cache data inside user: ",this.cache.getData());

    this.sub = this.route.params.subscribe(params => {
      this.user = params['user']; 
      console.log("user currently: ",this.user);
    });

  //login with jwt
  this.http.get<any>(environment.apiUrl+"auth/login", httpOptions).subscribe({
      next: data => {
        console.log("logged in as: ", data, data.token.access_token);
        // this.githubToken = data.token.access_token.toString();
        this.cache.setData({username: data.user, token: data.token.access_token, jwt: jwt})
        this.loggedIn = this.cache.getData() ? this.cache.getData().username : 'guest';
        this._snackBar.open("Signed In as "+data.user, "ok");
        this.router.navigate(['/profile', this.user]);
        console.log("inside log in func:", this.cache.getData())
      },
      error: error => {
        this._snackBar.open("Sign In for a better experiance", "ok");
        console.log('There was an error!', error);
      }
    })

    this.githubToken = this.cache.getData() ? this.cache.getData().token : environment.token;
    this.loggedIn = this.cache.getData() ? this.cache.getData().username : 'guest';
    this._snackBar.open("Signed In as "+this.loggedIn, "ok");
    this.router.navigate(['/profile', this.user]);


    this.http.get<any>("https://api.github.com/users/"+this.user,{
      // "headers": { 'Authorization': 'Bearer '+"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"}
      "headers": { 'Authorization': 'Bearer '+this.githubToken}
    }).subscribe({
      next: data => {
          this.userData = data;
          console.log(this.userData);
      },
      error: error => {
          console.error('There was an error!', error);
      }
    })

    this.http.get<any>("https://api.github.com/users/"+this.user+"/repos?per_page=100",{
      // "headers": { 'Authorization': 'Bearer '+"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"}
      "headers": { 'Authorization': 'Bearer '+this.githubToken}
    }).subscribe({
      next: data => {
          this.repos = data;
          console.log(this.repos);
      },
      error: error => {
          console.error('There was an error!', error);
      }
    })


    this.http.get<any>(environment.apiUrl+"user/"+this.user, httpOptions)
    .subscribe({
      next: res => {
          this.allData = res.data;
          this.projects = res.data.projects;
          console.log("all data",this.allData);
      },
      error: error => {
          console.error('There was an error!', error);
      }
    })


  }

  deleteProject(project: any){
    this.http.post<any>(environment.pvtUrl+"deleteProject/"+this.user,project,httpOptions).subscribe({
      next: data => {
          console.log(data.message);
          this._snackBar.open(data.message, "ok");
          window.location.reload(); 
      },
      error: error => {
          console.error('There was an error!', error);
          this._snackBar.open("There was an error!", "ok");
      }
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }


  open() {
		const modalRef = this.modalService.open(SignupComponent);
		modalRef.componentInstance.prefilled = this.allData;
    modalRef.componentInstance.update = true;
	}

  openAdd() {
		const modalRef = this.modalService.open(AddProjectComponent);
    // console.log(this.user)
		modalRef.componentInstance.name = this.user;
	}


  generateRandomColor(): string {
    // Generate a random color in hex format
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  generatePastelColor(): string {
    const baseColor = 150;  // Adjust the base color value as needed
    const randomOffset = 105;  // Adjust the random offset for variation
  
    // Generate random RGB values within the pastel range
    const red = Math.floor(Math.random() * randomOffset) + baseColor;
    const green = Math.floor(Math.random() * randomOffset) + baseColor;
    const blue = Math.floor(Math.random() * randomOffset) + baseColor;
  
    const alpha = 0.65;  // Adjust the alpha value as needed (0.0 to 1.0)
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }


}

