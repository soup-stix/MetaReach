import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SignupComponent } from '../signup/signup.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddProjectComponent } from '../add-project/add-project.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';
import { CacheService } from '../shared/cacheService';


const httpOptions = {
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
  projects: any[] = [{title:"test", desc:"testing desc",stack:["test", "test", "test", "test", "test", "test", "test"]}];

  constructor(private cache: CacheService, public _snackBar: MatSnackBar, private route: ActivatedRoute, private http: HttpClient, private modalService: NgbModal) {}

  async ngOnInit() {
    this.loggedIn = this.cache.getData().username;

    if (this.loggedIn != "guest"){
  //login with jwt
  this.http.get<any>(environment.apiUrl+"auth/login", httpOptions).subscribe({
      next: data => {
        console.log("logged in as: ", data, data.token.access_token);
        // this.githubToken = data.token.access_token.toString();
        this.cache.setData({username: data.user, token: data.token.access_token})
        this._snackBar.open("Signed In as "+data.user, "ok");
        console.log("inside log in func:", this.cache.getData())
      },
      error: error => {
        console.error('There was an error!', error);
      }
    })
}

this.sub = this.route.params.subscribe(params => {
  this.user = params['user']; 
  console.log(this.user);
});
this.githubToken = this.cache.getData().token;



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
      "headers": { 'Authorization': 'Bearer '+"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"}
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
}

