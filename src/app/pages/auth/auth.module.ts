import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthComponent } from './auth.component';
import { RouteName } from 'src/app/shared';

const routes: Routes = [
  { path: '', redirectTo: RouteName.signup, pathMatch: 'full' },
  { path: ':name', component: AuthComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  declarations: [AuthComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes)],
})
export class AuthModule {}
