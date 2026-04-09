import {ApplicationConfig, provideBrowserGlobalErrorListeners} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {provideRouter, TitleStrategy, withComponentInputBinding, withRouterConfig} from '@angular/router';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import {routes} from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { AppTitleStrategy } from './core/services/app-title-strategy';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideCharts(withDefaultRegisterables()),
        provideRouter(
            routes,
            withComponentInputBinding(),
            withRouterConfig({
                paramsInheritanceStrategy: 'always',
            })
        ),
        {
            provide: TitleStrategy,
            useClass: AppTitleStrategy,
        },
    ]
};
