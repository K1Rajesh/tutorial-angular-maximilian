import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { exhaustMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor{

  constructor( private authService: AuthService) { }
  
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.userEvent.pipe(take(1),
      exhaustMap((user)=>{
        if(!user){
          return next.handle(req);
        }
        var modifiedReq = req.clone({params:new HttpParams().set("auth",user.token)});
        return next.handle(modifiedReq);
      })
    )

  }
}
/*

:Observable<HttpEvent<any>>

this.authService.userEvent.pipe(
  take(1),
  exhaustMap((user)=>{
    
    
  })
)
var modifiedReq = req.clone({params:new HttpParams().set("auth",user.token)});
*/
 
