import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseType, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(private authService:AuthService,
    private router:Router) { }
  isLoginMode = false;
  isLoading = false;
  isError=null;

  ngOnInit() {
  }
  onSubmit(authForm:NgForm){
    if(authForm.invalid){
      return;
    }
    
    const email=authForm.value.email;
    const password=authForm.value.password;
    this.isLoading=true;
    let authObs : Observable<AuthResponseType>;

    console.log(authForm);
    if(this.isLoginMode){
      authObs = this.authService.login(email,password);
    }else{
      authObs =this.authService.signup(email,password);
    }
    authObs.subscribe(
      (respnse)=>{
        this.isLoading=false;
        this.router.navigate(['/recipes']);


      },
      (errorMessage)=>{
        this.isLoading=false;
        this.isError=errorMessage;
        console.log("error: "+errorMessage);
      }
    );
    
    authForm.reset();

  }
  onChangeMode(){
    this.isLoginMode = !this.isLoginMode;
  }

}
