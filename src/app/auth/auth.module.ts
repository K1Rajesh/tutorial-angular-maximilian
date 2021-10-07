import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AuthComponent } from './auth.component';

const appRoutes: Routes = [  
    { path: 'auth', component: AuthComponent }
  ];

@NgModule({
    declarations:[  AuthComponent],
    imports:[SharedModule,FormsModule,RouterModule.forChild(appRoutes)]
})
export class AuthModule{


}