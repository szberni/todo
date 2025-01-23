import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth.component';
import { RouteName } from './enums';

const routes: Routes = [
  { path: 'auth/:name', component: AuthComponent },
  { path: '**', redirectTo: `auth/${RouteName.signup}` },
];

@NgModule({
  declarations: [AppComponent, AuthComponent],
  imports: [BrowserModule, CommonModule, ReactiveFormsModule, RouterModule.forRoot(routes)],
  exports: [AppComponent]
})
export class AuthModule {}
