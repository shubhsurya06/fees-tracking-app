import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

import { provideStore } from '@ngrx/store';
import { MasterReducer } from './store/master/reducer';
import { provideEffects } from '@ngrx/effects';
import { MasterEffects } from './store/master/effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    provideStore({
      master: MasterReducer
    }),
    provideEffects([MasterEffects])
  ]
};
