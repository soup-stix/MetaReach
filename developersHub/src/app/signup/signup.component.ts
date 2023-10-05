import { HttpClient, HttpHeaders, HttpXhrBackend } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import staticData from 'src/assets/config.json';
import { environment } from 'src/environments/environment';
import { CacheService } from '../shared/cacheService';
// import { githubUser } from '../shared/validators';

async function checkUser(value: any) {
  const http = new HttpClient(new HttpXhrBackend({ 
      build: () => new XMLHttpRequest() 
  }));
  let data = await http.get<any>("https://api.github.com/users/"+value).subscribe()
  console.log(data);
  return data ? true: false;
}

async function githubUser(control: AbstractControl): Promise<{ [key: string]: any; } | null>  {
  if (await checkUser(control.value)) {
    console.log("user found")
    return { invalidUsername: false };
  }
  return {invalidUsername:"Invalid Github User"};
}



let httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer `,
  }),
  withCredentials: true 
};

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent {
  @Input() prefilled: any;
  @Input() update!: boolean;
  portfolio: any;
  social: any;
  auth: any;
  countries: any;
  cities: any;
  githubValidity: boolean = false;

  profileForm: FormGroup = new FormGroup({});
  
  
  constructor(private cache: CacheService, private _snackBar: MatSnackBar, private http: HttpClient, public activeModal: NgbActiveModal, public fb: FormBuilder) {}


  ngOnInit() {

    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.cache.getData().jwt}`,
      }),
      withCredentials: true 
    };


   this.portfolio = staticData.portfolio;
   this.social = staticData.social;
   console.log("prefilled data:",this.prefilled)

   this.profileForm = this.fb.group({
    github: new FormControl(this.prefilled.github||'', Validators.required),
    leetcode: new FormControl(this.prefilled.leetcode||''),
    kaggle: new FormControl(this.prefilled.kaggle||''),
    hackerrank: new FormControl(this.prefilled.hackerrank||''),
    dribble: new FormControl(this.prefilled.dribble||''),
    behance: new FormControl(this.prefilled.behance||''),
    codechef: new FormControl(this.prefilled.codechef||''),
    codepen: new FormControl(this.prefilled.codepen||''),
    codeforces: new FormControl(this.prefilled.codeforces||''),
    facebook: new FormControl(this.prefilled.facebook||''),
    gmail: new FormControl(this.prefilled.gmail||''),
    linkedin: new FormControl(this.prefilled.linkedin||''),
    pinterest: new FormControl(this.prefilled.pinterest||''),
    reddit: new FormControl(this.prefilled.reddit||''),
    quora: new FormControl(this.prefilled.quora||''),
    slack: new FormControl(this.prefilled.slack||''),
    stackoverflow: new FormControl(this.prefilled.stackoverflow||''),
    twitter: new FormControl(this.prefilled.twitter||''),
    location: new FormControl(this.prefilled.location||''),
    work: new FormControl(this.prefilled.work||''),
    website: new FormControl(this.prefilled.website||''),
    phone: new FormControl(this.prefilled.phone||'')
  });

  if (this.prefilled.github){
    this.profileForm.controls["github"].disable()
  }

  }

  test(){
    console.log(this.profileForm)
    console.log(this.portfolio);
  }

  submit() {
    //check db for existing gihub username
    //check github for valid username
    this.profileForm.controls["github"].enable();
    console.log(this.profileForm.value)
    if (this.update == false){
        this.http.post<any>(environment.pvtUrl+"addUser",this.profileForm.value, httpOptions).subscribe({
          next: data => {
              console.log(data.message);
              this.activeModal.close('Close click')
              this._snackBar.open(data.message, "ok");
              // window.location.reload(); 
          },
          error: error => {
              console.error('There was an error!', error);
              this._snackBar.open(error.error.message, "ok");
              this.activeModal.close('Close click')
          }
        })
    }
    else {
      this.http.post<any>(environment.pvtUrl+"updateUser",this.profileForm.value, httpOptions)
      .subscribe({
        next: data => {
            console.log(data.message);
            this.activeModal.close('Close click')
            this._snackBar.open(data.message, "ok");
            window.location.reload(); 
        },
        error: error => {
            console.error('There was an error!', error);
            this._snackBar.open("There was an error!" , "ok");
            this.activeModal.close('Close click')
        }
      })
    }
    
  }

}
