import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SignupComponent } from '../signup/signup.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddProjectComponent } from '../add-project/add-project.component';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  githubToken: any;
  private sub: any;
  projectOpenState: boolean = true;
  githubOpenState: boolean = true;
  projects: any[] = [{title:"test", desc:"testing desc",stack:["test", "test", "test", "test", "test", "test", "test"]}];

  constructor(public _snackBar: MatSnackBar, private route: ActivatedRoute, private http: HttpClient, private modalService: NgbModal) {}

  async ngOnInit() {

  //login with jwt
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    withCredentials: true  // Include credentials (cookies)
  };

  this.http.get<any>("http://localhost:3000/auth/login", httpOptions).subscribe({
      next: data => {
        console.log("logged in as: ", data, data.token.access_token);
        // this.githubToken = data.token.access_token.toString();
        this._snackBar.open("Signed In as "+data.user, "ok");
      },
      error: error => {
        console.error('There was an error!', error);
      }
    })

   this.sub = this.route.params.subscribe(params => {
    this.user = params['user']; 
    console.log(this.user);
 });



    this.http.get<any>("https://api.github.com/users/"+this.user,{
      "headers": { 'Authorization': 'Bearer '+"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"}
      // "headers": { 'Authorization': 'Bearer '+this.githubToken}
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


    this.http.get<any>("http://127.0.0.1:3000/user/"+this.user,{
      headers: {
        'Content-Type': 'application/json'
      }
    })
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
    this.http.post<any>("http://127.0.0.1:3000/deleteProject/"+this.user,project,{
      "headers": { 
        'Content-Type': 'application/json'
      }
    }).subscribe({
      next: data => {
          console.log(data.message);
          this._snackBar.open(data.message, "ok");
          window.location.reload(); 
      },
      error: error => {
          console.error('There was an error!', error);
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

