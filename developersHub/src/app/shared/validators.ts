import { AbstractControl, Validator, ValidatorFn } from '@angular/forms';
import { HttpClient, HttpXhrBackend } from '@angular/common/http';

export class githubUser implements Validator {

    constructor(private http: HttpClient){}
    
    
    validate(control: AbstractControl) : {[key: string]: any} | null {
      if (checkUser(control.value)) {
        return {message: "Invalid Github User"};
      }
      return null;
    }
  }

  function checkUser(this: any, value: any) {
    const http = new HttpClient(new HttpXhrBackend({ 
        build: () => new XMLHttpRequest() 
    }));
    http.get<any>("https://api.github.com/users/"+value).subscribe({
    next: data => {
        if(data.login) {
            console.log(
            data.login,
            data.avatar_url
            );
            return true;
        }
        else{
            console.log("No GitHub")
        }
    },
    error: error => {
        // this.profileForm.valid = false;
        console.error('There was an error!', error);
    }})
    return false;
}

  export function blue(): ValidatorFn {  
    return (control: AbstractControl): { [key: string]: any } | null =>  
        control.value?.toLowerCase() === 'blue' 
            ? null : {message: "Invalid Github User"};
}


