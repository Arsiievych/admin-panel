import {Component} from '@angular/core';
import {AdminChatWidget} from './chat/admin-chat-widget/admin-chat-widget';
import {ChatToggleButton} from './chat/chat-toggle-button/chat-toggle-button';
import {Header} from './header/header';
import {Navigation} from './navigation/navigation';
import {RouterOutlet} from "@angular/router";
import {PageShell} from "./pages/page-shell/page-shell";

@Component({
    selector: 'app-root',
    imports: [
        AdminChatWidget,
        Header,
        Navigation,
        ChatToggleButton,
        RouterOutlet,
        PageShell,
    ],
    templateUrl: './app.html',
    styleUrl: './app.css',
})
export class App {
    protected isChatOpen = false;

    protected openChat(): void {
        this.isChatOpen = true;
    }

    protected closeChat(): void {
        this.isChatOpen = false;
    }
}
