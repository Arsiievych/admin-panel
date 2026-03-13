import { afterNextRender, Component, ElementRef, output, signal, viewChild } from '@angular/core';

type ChatMessage = {
  id: number;
  userId: string;
  userName: string;
  role: string;
  time: string;
  message: string;
  isOwn: boolean;
  isAdmin: boolean;
};

@Component({
  selector: 'app-admin-chat-widget',
  imports: [],
  templateUrl: './admin-chat-widget.html',
  styleUrl: './admin-chat-widget.css',
})
export class AdminChatWidget {
  readonly close = output<void>();
  private readonly messagesViewport = viewChild<ElementRef<HTMLDivElement>>('messagesViewport');
  private readonly composerInput = viewChild<ElementRef<HTMLTextAreaElement>>('composerInput');

  private readonly currentUser = {
    id: 'alex-morgan',
    name: 'Alex Morgan',
    role: 'Super Admin',
  };

  protected readonly messages = signal<ChatMessage[]>([
    {
      id: 1,
      userId: 'riley-chen',
      userName: 'Riley Chen',
      role: 'Support Lead',
      time: '09:12',
      message: 'Morning. Matchmaking latency is climbing on the EU ranked shard again.',
      isOwn: false,
      isAdmin: false,
    },
    {
      id: 2,
      userId: 'alex-morgan',
      userName: 'Alex Morgan',
      role: 'Super Admin',
      time: '09:13',
      message: 'I saw the alert. Are queue times still moving up after the last config push?',
      isOwn: true,
      isAdmin: true,
    },
    {
      id: 3,
      userId: 'nora-diaz',
      userName: 'Nora Diaz',
      role: 'Community Manager',
      time: '09:14',
      message: 'Yes. Players already opened two incident threads, but sentiment is still manageable.',
      isOwn: false,
      isAdmin: false,
    },
    {
      id: 4,
      userId: 'liam-patel',
      userName: 'Liam Patel',
      role: 'QA Analyst',
      time: '09:15',
      message: 'QA can reproduce the spike only in ranked squads. Casual queues look normal.',
      isOwn: false,
      isAdmin: false,
    },
    {
      id: 5,
      userId: 'maya-ross',
      userName: 'Maya Ross',
      role: 'System Admin',
      time: '09:16',
      message: 'Comparing the live shard bundle against the previous stable revision now.',
      isOwn: false,
      isAdmin: true,
    },
    {
      id: 6,
      userId: 'alex-morgan',
      userName: 'Alex Morgan',
      role: 'Super Admin',
      time: '09:17',
      message: 'Approve the rollback if the diff confirms the queue worker mismatch.',
      isOwn: true,
      isAdmin: true,
    },
    {
      id: 7,
      userId: 'riley-chen',
      userName: 'Riley Chen',
      role: 'Support Lead',
      time: '09:18',
      message: 'Rollback is live. Queue time dropped from 210 seconds to 64 in the last minute.',
      isOwn: false,
      isAdmin: false,
    },
    {
      id: 8,
      userId: 'nora-diaz',
      userName: 'Nora Diaz',
      role: 'Community Manager',
      time: '09:19',
      message: 'Pinned a status update in Discord and the launcher. I will keep the incident thread open.',
      isOwn: false,
      isAdmin: false,
    },
    {
      id: 9,
      userId: 'liam-patel',
      userName: 'Liam Patel',
      role: 'QA Analyst',
      time: '09:21',
      message: 'Smoke checks passed on PC and console. I am monitoring one more ranked cycle.',
      isOwn: false,
      isAdmin: false,
    },
    {
      id: 10,
      userId: 'alex-morgan',
      userName: 'Alex Morgan',
      role: 'Super Admin',
      time: '09:22',
      message: 'Good. Keep this room open for another 30 minutes and post if the graph bends again.',
      isOwn: true,
      isAdmin: true,
    },
  ]);

  protected readonly draftMessage = signal('');

  private readonly mutedParticipantIds = signal<string[]>([]);
  private nextMessageId = 11;

  constructor() {
    afterNextRender(() => this.scrollMessagesToBottom());
  }

  protected toggleMute(participantId: string): void {
    this.mutedParticipantIds.update((participantIds) =>
      participantIds.includes(participantId)
        ? participantIds.filter((id) => id !== participantId)
        : [...participantIds, participantId],
    );
  }

  protected isMuted(participantId: string): boolean {
    return this.mutedParticipantIds().includes(participantId);
  }

  protected canMuteMessage(message: ChatMessage): boolean {
    return !message.isOwn && !message.isAdmin;
  }

  protected updateDraft(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;

    this.draftMessage.set(textarea.value);
    this.resizeComposer(textarea);
  }

  protected handleComposerKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  protected sendMessage(): void {
    const message = this.draftMessage().trim();

    if (!message) {
      return;
    }

    this.messages.update((messages) => [
      ...messages,
      {
        id: this.nextMessageId++,
        userId: this.currentUser.id,
        userName: this.currentUser.name,
        role: this.currentUser.role,
        time: this.getCurrentTime(),
        message,
        isOwn: true,
        isAdmin: true,
      },
    ]);

    this.draftMessage.set('');
    this.resetComposerHeight();
    queueMicrotask(() => this.scrollMessagesToBottom());
  }

  private getCurrentTime(): string {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date());
  }

  private scrollMessagesToBottom(): void {
    const messagesViewport = this.messagesViewport()?.nativeElement;

    if (!messagesViewport) {
      return;
    }

    messagesViewport.scrollTop = messagesViewport.scrollHeight;
  }

  private resetComposerHeight(): void {
    const textarea = this.composerInput()?.nativeElement;

    if (!textarea) {
      return;
    }

    textarea.style.height = '';
  }

  private resizeComposer(textarea: HTMLTextAreaElement): void {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
}
