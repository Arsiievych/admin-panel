import {Routes} from '@angular/router';
import {AdminLayout} from './layouts/admin-layout/admin-layout';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
    },
    {
        path: 'dashboard',
        redirectTo: '',
        pathMatch: 'full',
    },
    {
        path: '',
        component: AdminLayout,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'dashboard',
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
            },
            {
                path: 'players',
                loadComponent: () => import('./features/players/players').then((m) => m.Players),
            },
            {
                path: 'settings',
                loadComponent: () => import('./features/settings/settings').then((m) => m.Settings),
            },
        ],
    }
];
