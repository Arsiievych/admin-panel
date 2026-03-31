import { Routes } from '@angular/router';
import {Dashboard} from "./dashboard/dashboard";
import {Players} from "./players/players";
import {Settings} from "./settings/settings";

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
    },
    {
        path: 'dashboard',
        pathMatch: 'full',
        component: Dashboard,
    },
    {
        path: 'players',
        pathMatch: 'full',
        component: Players,
    },
    {
        path: 'settings',
        pathMatch: 'full',
        component: Settings,
    }
];
