import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  withCredentials: true 
};


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor(public activeModal: NgbActiveModal, private http: HttpClient, private _snackBar: MatSnackBar) { }

  // deleteProject(project: any,user: any){
  //   this.http.post<any>(environment.pvtUrl+"deleteProject/"+user,project, httpOptions).subscribe({
  //     next: data => {
  //         console.log(data.message);
  //         this._snackBar.open(data.message, "ok");
  //         window.location.reload(); 
  //     },
  //     error: error => {
  //         console.error('There was an error!', error);
  //         this._snackBar.open("There was an error!", "ok");
  //     }
  //   })
  // }


  // addProject(name: string, value: any){
  //   this.http.post<any>("http://localhost:3000/pvt/addProject/"+name,value,{
  //     "headers": { 
  //       'Content-Type': 'application/json'
  //     },
  //     withCredentials: true
  //   }).subscribe({
  //     next: data => {
  //         console.log(data.message);
  //         this._snackBar.open(data.message, "ok");
  //         this.activeModal.close('Close click')
  //         window.location.reload(); 
  //     },
  //     error: error => {
  //         console.error('There was an error!', error);
  //         this._snackBar.open("There was an error!", "ok");
  //     }
  //   })
  // }

}
