import { DoBootstrap, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements'
import { EntryComponent } from './entry.component';
import { AuthModule } from '../auth.module';

@NgModule({
  declarations: [EntryComponent],
  imports: [AuthModule],
})
export class MicrofrontendModule implements DoBootstrap {
  constructor(private injector: Injector) {}

  ngDoBootstrap(): void {
    const customElement = createCustomElement(EntryComponent, {
      injector: this.injector
    });

    window.customElements.define('mf-auth-entry', customElement);
  }
}