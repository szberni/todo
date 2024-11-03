import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ToastrModule } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from './app.component';
import { FeatureKey, RouteName, AuthGuard, AuthLoggedInGuard } from './shared';
import {
  authReducer,
  AuthEffects,
  boardsReducer,
  BoardEffects,
  listsReducer,
  ListsEffects,
  cardsReducer,
  CardsEffects,
} from './store';

const appRoutes: Routes = [
  { path: '', redirectTo: RouteName.auth, pathMatch: 'full' },
  {
    path: RouteName.home,
    loadChildren: () => import('./pages/home/home.module').then((m) => m.HomeModule),
    canActivate: [AuthGuard],
  },
  {
    path: RouteName.auth,
    loadChildren: () => import('./pages/auth/auth.module').then((m) => m.AuthModule),
    canActivate: [AuthLoggedInGuard],
  },
  { path: '**', redirectTo: RouteName.auth },
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    ModalModule.forRoot(),
    ToastrModule.forRoot(),
    StoreModule.forRoot({
      [FeatureKey.auth]: authReducer,
      [FeatureKey.boards]: boardsReducer,
      [FeatureKey.lists]: listsReducer,
      [FeatureKey.cards]: cardsReducer,
    }),
    EffectsModule.forRoot([AuthEffects, BoardEffects, ListsEffects, CardsEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
})
export class AppModule {}
