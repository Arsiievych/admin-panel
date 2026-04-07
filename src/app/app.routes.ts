import {Routes} from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import {AdminLayout} from './layouts/admin-layout/admin-layout';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
    },
    {
        path: 'not-found',
        canActivate: [authGuard],
        loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
    },
    {
        path: 'dashboard',
        redirectTo: '',
        pathMatch: 'full',
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
                loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
            },
            {
                path: 'players',
                loadComponent: () => import('./features/players/players').then((m) => m.Players),
            },
            {
                path: 'legions',
                data: { title: 'Legions' },
                loadComponent: () => import('./features/section-placeholder/section-placeholder').then((m) => m.SectionPlaceholder),
            },
            {
                path: 'battles',
                data: { title: 'Battles' },
                loadComponent: () => import('./features/section-placeholder/section-placeholder').then((m) => m.SectionPlaceholder),
            },
            {
                path: 'economy',
                data: { title: 'Economy' },
                loadComponent: () => import('./features/section-placeholder/section-placeholder').then((m) => m.SectionPlaceholder),
            },
            {
                path: 'inventory',
                data: { title: 'Inventory' },
                loadComponent: () => import('./features/section-placeholder/section-placeholder').then((m) => m.SectionPlaceholder),
            },
            {
                path: 'store',
                data: { title: 'Store' },
                loadComponent: () => import('./features/section-placeholder/section-placeholder').then((m) => m.SectionPlaceholder),
            },
            {
                path: 'leaderboards',
                data: { title: 'Leaderboards' },
                loadComponent: () => import('./features/section-placeholder/section-placeholder').then((m) => m.SectionPlaceholder),
            },
            {
                path: 'moderation',
                data: { title: 'Moderation' },
                loadComponent: () => import('./features/section-placeholder/section-placeholder').then((m) => m.SectionPlaceholder),
            },
            {
                path: 'analytics',
                data: { title: 'Analytics' },
                loadComponent: () => import('./features/section-placeholder/section-placeholder').then((m) => m.SectionPlaceholder),
            },
            {
                path: 'admin-users',
                data: { title: 'Admin Users' },
                loadComponent: () => import('./features/section-placeholder/section-placeholder').then((m) => m.SectionPlaceholder),
            },
            {
                path: 'audit-log',
                data: { title: 'Audit Log' },
                loadComponent: () => import('./features/section-placeholder/section-placeholder').then((m) => m.SectionPlaceholder),
            },
            {
                path: 'profile',
                loadComponent: () => import('./features/profile/profile').then((m) => m.Profile),
            },
            {
                path: 'settings',
                loadComponent: () => import('./features/settings/settings').then((m) => m.Settings),
            },
        ],
    },
    {
        path: '**',
        redirectTo: 'not-found',
    },
];
