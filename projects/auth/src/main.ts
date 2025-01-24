import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { MicrofrontendModule } from './app/micro-frontend/micro-frontend.module';
import { DevPlatformModule } from './app/dev-platform/dev-platform.module';
import { environment } from './environments/environment';

const bootstrapModule = environment.embedded
  ? MicrofrontendModule
  : DevPlatformModule;

platformBrowserDynamic()
  .bootstrapModule(bootstrapModule)
  .catch(err => console.error(err));
