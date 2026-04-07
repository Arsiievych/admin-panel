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
                loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
            },
            {
                path: 'players',
                title: 'Players',
                loadComponent: () => import('./features/players/players').then((m) => m.Players),
            },
            {
                path: 'legions',
                title: 'Legions',
                data: { title: 'Legions' },
                loadComponent: () => import('./features/section-placeholder/section-placeholder').then((m) => m.SectionPlaceholder),
            },
            {
                path: 'battles',
                title: 'Battles',
                data: { title: 'Battles' },
                loadComponent: () => import('./features/section-placeholder/section-placeholder').then((m) => m.SectionPlaceholder),
            },
            {
                path: 'economy',
                title: 'Economy',
                data: { title: 'Economy' },
                loadComponent: () => import('./features/section-placeholder/section-placeholder').then((m) => m.SectionPlaceholder),
            },
            {
                path: 'inventory',
                title: 'Inventory',
                data: { title: 'Inventory' },
                loadComponent: () => import('./features/section-placeholder/section-placeholder').then((m) => m.SectionPlaceholder),
            },
            {
                path: 'store',
                title: 'Store',
                data: { title: 'Store' },
                loadComponent: () => import('./features/section-placeholder/section-placeholder').then((m) => m.SectionPlaceholder),
            },
            {
                path: 'leaderboards',
                title: 'Leaderboards',
                data: { title: 'Leaderboards' },
                loadComponent: () => import('./features/section-placeholder/section-placeholder').then((m) => m.SectionPlaceholder),
            },
            {
                path: 'moderation',
                title: 'Moderation',
                data: { title: 'Moderation' },
                loadComponent: () => import('./features/section-placeholder/section-placeholder').then((m) => m.SectionPlaceholder),
            },
            {
                path: 'analytics',
                title: 'Analytics',
                data: { title: 'Analytics' },
                loadComponent: () => import('./features/section-placeholder/section-placeholder').then((m) => m.SectionPlaceholder),
            },
            {
                path: 'admin-users',
                title: 'Admin Users',
                data: { title: 'Admin Users' },
                loadComponent: () => import('./features/section-placeholder/section-placeholder').then((m) => m.SectionPlaceholder),
            },
            {
                path: 'audit-log',
                title: 'Audit Log',
                data: { title: 'Audit Log' },
                loadComponent: () => import('./features/section-placeholder/section-placeholder').then((m) => m.SectionPlaceholder),
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
