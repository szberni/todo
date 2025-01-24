import { NgModule } from '@angular/core';
import { AuthModule } from '../auth.module';
import { AppComponent } from '../app.component';

@NgModule({
  imports: [AuthModule],
  bootstrap: [AppComponent],
})
export class DevPlatformModule {}