import { Routes } from '@angular/router';
import {Dashboard} from "./dashboard/dashboard";

export const routes: Routes = [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'dashboard',
    // },
    {
        path: 'dashboard',
        pathMatch: 'full',
        component: Dashboard,
    },
    {
        path: 'players',
        pathMatch: 'full',
        component: Dashboard,
    },
    {
        path: 'settings',
        pathMatch: 'full',
        component: Dashboard,
    }
];
