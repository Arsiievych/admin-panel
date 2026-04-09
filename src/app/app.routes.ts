import {Routes} from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import {AdminLayout} from './layouts/admin-layout/admin-layout';

export const routes: Routes = [
    {
        path: 'login',
        title: 'Login',
        loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
    },
    {
        path: 'not-found',
        title: 'Page not found',
        canActivate: [authGuard],
        loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
    },
    {
        path: '',
        component: AdminLayout,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'dashboard',
            },
            {
                path: 'dashboard',
                title: 'Dashboard',
                data: { title: 'Dashboard' },
                loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
            },
            {
                path: 'chat',
                title: 'Chat',
                data: { title: 'Chat' },
                loadComponent: () => import('./features/chat/chat').then((m) => m.Chat),
            },
            {
                path: 'manage-users',
                title: 'Manage Users',
                data: { title: 'Manage Users' },
                loadComponent: () => import('./features/admin-users/admin-users').then((m) => m.AdminUsers),
            },
            {
                path: 'profile',
                title: 'My profile',
                loadComponent: () => import('./features/profile/profile').then((m) => m.Profile),
            },
            {
                path: 'settings',
                title: 'Settings',
                loadComponent: () => import('./features/settings/settings').then((m) => m.Settings),
            },
        ],
    },
    {
        path: '**',
        redirectTo: 'not-found',
    },
];
