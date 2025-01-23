import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthHostComponent } from './auth-host.component';
import { LoadMicroFrontendGuard } from './load-micro-frontend.guard';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [AuthHostComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '**',
        canActivate: [LoadMicroFrontendGuard],
        component: AuthHostComponent,
        data: {
          bundleUrl: 'http://localhost:4201/main.js',
        },
      },
    ]),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AuthHostModule {}