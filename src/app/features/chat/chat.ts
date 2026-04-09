import { Component, OnDestroy, computed, signal } from '@angular/core';
import { PageShell } from '../../shared/ui/page-shell/page-shell';

type ChatRole = 'User' | 'Moderator' | 'Admin' | 'Super Admin';

type ChatMessage = {
  id: number;
  userId: string;
  userName: string;
  role: ChatRole;
  time: string;
  message: string;
};

type MutedUser = {
  userId: string;
  userName: string;
  role: ChatRole;
  mutedUntil: number;
};

@Component({
  selector: 'app-chat-page',
  imports: [PageShell],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat implements OnDestroy {
  private readonly nowInterval = window.setInterval(() => {
    this.now.set(Date.now());
  }, 60_000);

  readonly muteDurations = [
    { label: '1 hour', hours: 1 },
    { label: '4 hours', hours: 4 },
    { label: '8 hours', hours: 8 },
    { label: '1 day', hours: 24 },
    { label: '7 days', hours: 168 },
    { label: '30 days', hours: 720 },
  ] as const;
  readonly now = signal(Date.now());
  readonly selectedMessageId = signal<number | null>(1);
  readonly messages = signal<ChatMessage[]>([
    {
      id: 1,
      userId: 'trader-91',
      userName: 'Trader91',
      role: 'User',
      time: '09:12',
      message: 'Queue looks much better now. Ranked popped in under a minute for me.',
    },
    {
      id: 2,
      userId: 'alex-morgan',
      userName: 'Alex Morgan',
      role: 'Super Admin',
      time: '09:14',
      message: 'Keep the global room visible for now. I want live sentiment and bug chatter in one stream.',
    },
    {
      id: 3,
      userId: 'capslock-chief',
      userName: 'CapsLock Chief',
      role: 'User',
      time: '09:16',
      message: 'Trade chat is still full of spam links. Someone should clean that room up.',
    },
    {
      id: 4,
      userId: 'devin-park',
      userName: 'Devin Park',
      role: 'Moderator',
      time: '09:18',
      message: 'Trade spam cluster confirmed. Reviewing reports and issuing timed mutes now.',
    },
    {
      id: 5,
      userId: 'maya-ross',
      userName: 'Maya Ross',
      role: 'Admin',
      time: '09:20',
      message: 'Redis cache pressure normalized. Chat throughput is back inside target range.',
    },
    {
      id: 6,
      userId: 'kira-volt',
      userName: 'KiraVolt',
      role: 'User',
      time: '09:24',
      message: 'Can we get an official post about the rollback? People keep asking if rewards are safe.',
    },
    {
      id: 7,
      userId: 'riley-storm',
      userName: 'RileyStorm',
      role: 'User',
      time: '09:27',
      message: 'Match chat is stable on console now. No disconnects in my last three games.',
    },
  ]);

  readonly mutedUsers = signal<MutedUser[]>([
    {
      userId: 'trader-91',
      userName: 'Trader91',
      role: 'User',
      mutedUntil: Date.now() + 3.5 * 60 * 60 * 1000,
    },
    {
      userId: 'capslock-chief',
      userName: 'CapsLock Chief',
      role: 'User',
      mutedUntil: Date.now() + 26 * 60 * 60 * 1000,
    },
  ]);

  readonly selectedMessage = computed(() =>
    this.messages().find((message) => message.id === this.selectedMessageId()) ?? this.messages()[0]
  );
  readonly canMuteSelectedMessage = computed(() => this.canMuteRole(this.selectedMessage().role));
  readonly canDeleteSelectedMessage = computed(() => this.canMuteRole(this.selectedMessage().role));

  readonly activeMutedUsers = computed(() => {
    const currentTime = this.now();

    return this.mutedUsers()
      .filter((user) => user.mutedUntil > currentTime)
      .sort((left, right) => left.mutedUntil - right.mutedUntil);
  });

  ngOnDestroy(): void {
    window.clearInterval(this.nowInterval);
  }

  selectMessage(messageId: number): void {
    this.selectedMessageId.set(messageId);
  }

  muteSelectedUser(hours: number): void {
    const selectedMessage = this.selectedMessage();

    if (!this.canMuteRole(selectedMessage.role)) {
      return;
    }

    const mutedUntil = Date.now() + hours * 60 * 60 * 1000;

    this.mutedUsers.update((users) => {
      const existingUser = users.find((user) => user.userId === selectedMessage.userId);

      if (existingUser) {
        return users.map((user) =>
          user.userId === selectedMessage.userId
            ? { ...user, role: selectedMessage.role, userName: selectedMessage.userName, mutedUntil }
            : user
        );
      }

      return [
        ...users,
        {
          userId: selectedMessage.userId,
          userName: selectedMessage.userName,
          role: selectedMessage.role,
          mutedUntil,
        },
      ];
    });
  }

  deleteSelectedMessage(): void {
    const selectedMessage = this.selectedMessage();

    if (!this.canMuteRole(selectedMessage.role)) {
      return;
    }

    this.messages.update((messages) => messages.filter((message) => message.id !== selectedMessage.id));
    this.selectedMessageId.set(this.messages()[0]?.id ?? null);
  }

  unmuteUser(userId: string): void {
    this.mutedUsers.update((users) => users.filter((user) => user.userId !== userId));
  }

  isMuted(userId: string): boolean {
    const currentTime = this.now();

    return this.mutedUsers().some((user) => user.userId === userId && user.mutedUntil > currentTime);
  }

  canMuteRole(role: ChatRole): boolean {
    return role === 'User';
  }

  roleClass(role: ChatRole): 'user' | 'moderator' | 'admin' | 'super-admin' {
    switch (role) {
      case 'Super Admin':
        return 'super-admin';
      case 'Admin':
        return 'admin';
      case 'Moderator':
        return 'moderator';
      default:
        return 'user';
    }
  }

  initials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('');
  }

  muteDurationLabel(hours: number): string {
    if (hours < 24) {
      return `${hours}h`;
    }

    if (hours === 24) {
      return '1d';
    }

    if (hours === 168) {
      return '7d';
    }

    return '30d';
  }

  timeLeftLabel(mutedUntil: number): string {
    const remainingMs = Math.max(0, mutedUntil - this.now());
    const totalMinutes = Math.ceil(remainingMs / 60_000);

    if (totalMinutes < 60) {
      return `${totalMinutes}m left`;
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours < 24) {
      return minutes ? `${hours}h ${minutes}m left` : `${hours}h left`;
    }

    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    return remainingHours ? `${days}d ${remainingHours}h left` : `${days}d left`;
  }
}
