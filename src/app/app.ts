import { Component } from '@angular/core';
import { ChatToggleButton } from './chat/chat-toggle-button/chat-toggle-button';
import { Header } from './header/header';
import { Navigation } from './navigation/navigation';
import { NavigationItem } from './navigation/navigation-item/navigation-item';
import { PageShell } from './pages/page-shell/page-shell';

@Component({
  selector: 'app-root',
  imports: [
    Header,
    Navigation,
    NavigationItem,
    PageShell,
    ChatToggleButton,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
}
