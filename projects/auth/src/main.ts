import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { MicrofrontendModule } from './app/micro-frontend/micro-frontend.module';

platformBrowserDynamic()
  .bootstrapModule(MicrofrontendModule)
  .catch(err => console.error(err));
