import { Component,OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit,OnDestroy {
  isAuthenticated = false;
  authSubscription : Subscription;
  constructor(private dataStorageService : DataStorageService,
    private authService: AuthService){

  }
  ngOnInit(){
    this.authSubscription = this.authService.userEvent.subscribe((user)=>{
      this.isAuthenticated = !!user; //(!user=> no user) i.e if the user is not null isAuthenticated set tot true
      console.log(this.isAuthenticated);
    });
  }
  onStoreRecipes(){
    this.dataStorageService.storeRecipes()
  }
  onFetchRecipes(){
    this.dataStorageService.fetchRecipes().subscribe(()=>{
      //console.log("At HeaderComponent - onFetchRecipes - subscribe");
    });
  }
  onLogout(){
    this.authService.logout();
  }
  ngOnDestroy(){
    this.authSubscription.unsubscribe();
  }
}