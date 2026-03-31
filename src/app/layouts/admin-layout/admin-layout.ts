import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AdminChatWidget} from '../../chat/admin-chat-widget/admin-chat-widget';
import {ChatToggleButton} from '../../chat/chat-toggle-button/chat-toggle-button';
import {Header} from './header/header';
import {Navigation} from './navigation/navigation';

@Component({
    selector: 'app-admin-layout',
    imports: [
        AdminChatWidget,
        ChatToggleButton,
        Header,
        Navigation,
        RouterOutlet,
    ],
    templateUrl: './admin-layout.html',
    styleUrl: './admin-layout.css',
})
export class AdminLayout {
    protected isChatOpen = false;

    protected openChat(): void {
        this.isChatOpen = true;
    }

    protected closeChat(): void {
        this.isChatOpen = false;
    }
}
