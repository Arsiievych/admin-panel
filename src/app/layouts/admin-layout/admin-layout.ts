import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Header} from './header/header';
import {Navigation} from './navigation/navigation';

@Component({
    selector: 'app-admin-layout',
    imports: [
        Header,
        Navigation,
        RouterOutlet,
    ],
    templateUrl: './admin-layout.html',
    styleUrl: './admin-layout.css',
})
export class AdminLayout {}
