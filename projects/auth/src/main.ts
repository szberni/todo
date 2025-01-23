import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AuthModule } from './app/auth.module';

platformBrowserDynamic()
  .bootstrapModule(AuthModule)
  .catch(err => console.error(err));
