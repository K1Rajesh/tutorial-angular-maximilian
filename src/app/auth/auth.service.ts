import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap, } from 'rxjs/operators';
import { User } from './user.model';

export interface AuthResponseType{
  idToken : string;
  email : string;
  refreshToken : string;
  expiresIn : string;
  localId : string;
  registered? : boolean;

}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private signupURL = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + 
  "AIzaSyBn9UdjIUPu9c5kv6rTDR9OjmUzZvx7EFM";
  private loginURL :string = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" +
  "AIzaSyBn9UdjIUPu9c5kv6rTDR9OjmUzZvx7EFM";

  private error:string = null;
  private tokenExpirationTimer : any;

  userEvent= new BehaviorSubject<User>(null);

  constructor(private http:HttpClient,private router:Router) { }
  signup(email:string,password:string):Observable<AuthResponseType>{
    return this.http.post<AuthResponseType>(this.signupURL,
      {email:email,password:password,returnSecureToken:true})
      .pipe(
        catchError(this.handleHttpErrors),
        tap((response)=>{
          console.log(response);
          this.handleAuthentication(response.email,response.localId,response.idToken,+response.expiresIn);
        })
      );
  }
  login(email:string,password:string):Observable<AuthResponseType>{
    return this.http.post<AuthResponseType>(this.loginURL,{email:email,password:password,returnSecureToken:true})
    .pipe(
      catchError(this.handleHttpErrors),
      tap((response)=>{
        console.log(response);
        this.handleAuthentication(response.email,response.localId,response.idToken,+response.expiresIn);
        //console.log("At login user token:"+ response.idToken);
      })
    );

  }

  autoLogin(){
    const userdata:{ email : string,
        id: string,
        _token : string,
        _tokenExpirationDate : Date} = JSON.parse(localStorage.getItem('userdata'))
       console.log("user fetched from local storage",userdata)   
    if(!userdata){return;}
    const loadedUser = new User(userdata.email,userdata.id,userdata._token,
      new Date(userdata._tokenExpirationDate));
      if(loadedUser.token){
        console.log("loading user on refresh",loadedUser)
        this.userEvent.next(loadedUser);
        const expirationDuration = new Date(userdata._tokenExpirationDate).getTime() - new Date().getTime()
        this.autoLogout(expirationDuration)
      }
    
  }
  logout(){
    const user = null
    this.userEvent.next(user);
    this.router.navigate(['/auth'])
    localStorage.removeItem('userdata')
    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer) 
      
    }
    this.tokenExpirationTimer = null

  }
  autoLogout(expirationDuration:number){
    this.tokenExpirationTimer = setTimeout(()=>{this.logout()},expirationDuration)

  }

  private handleAuthentication(email:string,localId:string,idToken:string,expiresIn:number){
    if(Number.isNaN(expiresIn)){
      console.log("at handleAuthentication - recieved expiresIn: "+expiresIn);
      console.log("temporarily set expiresIn=3600 ");
      expiresIn = 3600;
    }
    const expirationDate = new Date(new Date().getTime()+ expiresIn*1000);
    const user = new User(email,localId,idToken,expirationDate);
    console.log(new Date().getTime()+":"+expiresIn);

    localStorage.setItem('userdata', JSON.stringify(user))
    this.userEvent.next(user);
    this.autoLogout(expiresIn*1000)
  }
  private handleHttpErrors(errorResponse:HttpErrorResponse){

    let errorMeassage = "An unknow Error"
    if(!errorResponse.error||!errorResponse.error.error.message){
      return throwError(errorMeassage);
    }
    switch (errorResponse.error.error.message){
      case 'EMAIL_EXISTS':
      errorMeassage = "This email already exists";
      break
      case 'EMAIL_NOT_FOUND':
        errorMeassage = "This email is not found";
      break
      case 'INVALID_PASSWORD':
        errorMeassage = "Invalid password";
      break
    }
    return throwError(errorMeassage);
  }
}
