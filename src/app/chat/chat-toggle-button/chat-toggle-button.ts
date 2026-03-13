import { Component, output } from '@angular/core';

@Component({
  selector: 'app-chat-toggle-button',
  imports: [],
  templateUrl: './chat-toggle-button.html',
  styleUrl: './chat-toggle-button.css',
})
export class ChatToggleButton {
  readonly open = output<void>();
}
