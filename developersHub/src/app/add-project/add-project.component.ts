import { HttpClient } from '@angular/common/http';
import { Component, Input, inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, ValidatorFn, AbstractControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserComponent } from '../user/user.component';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
  // providers: [UserComponent]
})
export class AddProjectComponent {
  @Input() name: any;
  portfolio: any;
  social: any;
  auth: any;
  countries: any;
  cities: any;
  githubValidity: boolean = false;
  keywords: string[] = [];
  announcer = inject(LiveAnnouncer);
  addProject: FormGroup = new FormGroup({});
  formControl = new FormControl([]);
  
  constructor(private _snackBar: MatSnackBar, private http: HttpClient, public activeModal: NgbActiveModal, public fb: FormBuilder) {}


  ngOnInit() {
  //  this.portfolio = staticData.portfolio;
  //  this.social = staticData.social;

  this.addProject = this.fb.group({
    title: this.fb.control("", Validators.required),
    desc: this.fb.control("", Validators.required),
    stack: this.fb.control([]),
  });
  }

  test(){
    console.log(this.addProject)
    console.log(this.portfolio);
  }

  removeKeyword(keyword: string) {
    const index = this.keywords.indexOf(keyword);
    if (index >= 0) {
      this.keywords.splice(index, 1);

      this.announcer.announce(`removed ${keyword}`);
    }
  }


  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our keyword
    if (value) {
      this.keywords.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }


  submit() {
    // this._snackBar.open("new project was added", "ok");
    // this.user.projects.push(this.formControl.value)
    console.log('submit worked: ', this.addProject.value, this.formControl.value, this.name)
    this.http.post<any>(environment.pvtUrl+"addProject/"+this.name,this.addProject.value,{
      "headers": { 
        'Content-Type': 'application/json'
      },
      withCredentials: true
    }).subscribe({
      next: data => {
          console.log(data.message);
          this._snackBar.open(data.message, "ok");
          this.activeModal.close('Close click')
          window.location.reload(); 
      },
      error: error => {
          console.error('There was an error!', error);
          this._snackBar.open("There was an error!", "ok");
      }
    })
    
  }
}
