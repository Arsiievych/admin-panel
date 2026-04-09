import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../../../environments/environment';
import packageJson from '../../../../package.json';
import { Header } from './header/header';
import { Navigation } from './navigation/navigation';

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
export class AdminLayout {
  readonly appVersion = packageJson.version;
  readonly environmentLabel = environment.production ? 'Production' : 'Development';
}
