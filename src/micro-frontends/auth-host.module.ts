import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthHostComponent } from './auth-host.component';
import { LoadMicroFrontendGuard } from './load-micro-frontend.guard';

@NgModule({
  declarations: [AuthHostComponent],
  imports: [
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