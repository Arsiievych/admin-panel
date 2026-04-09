import { Component, computed, signal } from '@angular/core';
import { PageShell } from '../../shared/ui/page-shell/page-shell';

type TicketStatus = 'Open' | 'In Progress' | 'Pending' | 'Resolved' | 'Closed';
type TicketPriority = 'Low' | 'Medium' | 'High';
type TicketRole = 'User' | 'Support' | 'System';

type TicketMessage = {
  id: number;
  author: string;
  role: TicketRole;
  time: string;
  message: string;
};

type SupportTicket = {
  id: number;
  userName: string;
  userEmail: string;
  subject: string;
  category: string;
  status: TicketStatus;
  priority: TicketPriority;
  date: string;
  messages: TicketMessage[];
};

@Component({
  selector: 'app-support-tickets',
  imports: [PageShell],
  templateUrl: './support-tickets.html',
  styleUrl: './support-tickets.css',
})
export class SupportTickets {
  readonly statuses: Array<'All' | TicketStatus> = ['All', 'Open', 'In Progress', 'Pending', 'Resolved', 'Closed'];

  readonly searchTerm = signal('');
  readonly statusFilter = signal<'All' | TicketStatus>('All');
  readonly selectedTicketId = signal<number | null>(1042);
  readonly replyDraft = signal('');

  readonly tickets = signal<SupportTicket[]>([
    {
      id: 1042,
      userName: 'Riley Storm',
      userEmail: 'riley@supportmail.gg',
      subject: 'Ranked reward rollback missing from inventory',
      category: 'Reward Issue',
      status: 'Open',
      priority: 'High',
      date: 'Apr 09, 09:18',
      messages: [
        {
          id: 1,
          author: 'Riley Storm',
          role: 'User',
          time: '09:18',
          message: 'After the rollback my ranked chest is gone, but the match still consumed my ticket.',
        },
        {
          id: 2,
          author: 'Sarah K',
          role: 'Support',
          time: '09:24',
          message: 'We are checking rollback-related entitlement issues now. I will update you once I confirm the item trace.',
        },
      ],
    },
    {
      id: 1041,
      userName: 'June Vex',
      userEmail: 'june.vex@supportmail.gg',
      subject: 'Payment charged twice on founder bundle',
      category: 'Payment Issue',
      status: 'Pending',
      priority: 'High',
      date: 'Apr 09, 09:05',
      messages: [
        {
          id: 1,
          author: 'June Vex',
          role: 'User',
          time: '09:05',
          message: 'Apple Pay confirmed two charges but I only received one founder bundle in game.',
        },
      ],
    },
    {
      id: 1039,
      userName: 'Kai Mercer',
      userEmail: 'kai.mercer@supportmail.gg',
      subject: 'Guild creation fails after name confirmation',
      category: 'Bug Report',
      status: 'In Progress',
      priority: 'Medium',
      date: 'Apr 09, 08:41',
      messages: [
        {
          id: 1,
          author: 'Kai Mercer',
          role: 'User',
          time: '08:41',
          message: 'Guild name passes validation, but the final confirm button does nothing on Android.',
        },
        {
          id: 2,
          author: 'System',
          role: 'System',
          time: '08:47',
          message: 'Ticket tagged with `guilds`, `android`, and `creation-flow`.',
        },
      ],
    },
    {
      id: 1036,
      userName: 'Nika Vale',
      userEmail: 'nika.vale@supportmail.gg',
      subject: 'Unable to claim battle pass premium track',
      category: 'Account Issue',
      status: 'Open',
      priority: 'High',
      date: 'Apr 09, 08:22',
      messages: [
        {
          id: 1,
          author: 'Nika Vale',
          role: 'User',
          time: '08:22',
          message: 'I purchased premium but the right-side rewards are still locked and every level says claim unavailable.',
        },
      ],
    },
    {
      id: 1031,
      userName: 'Axel Rowan',
      userEmail: 'axel.rowan@supportmail.gg',
      subject: 'Chat filter blocked normal clan name',
      category: 'Moderation',
      status: 'Resolved',
      priority: 'Low',
      date: 'Apr 08, 22:15',
      messages: [
        {
          id: 1,
          author: 'Axel Rowan',
          role: 'User',
          time: '22:15',
          message: 'Clan name was rejected as profanity but it is just `Iron Harbor`.',
        },
        {
          id: 2,
          author: 'Sarah K',
          role: 'Support',
          time: '22:34',
          message: 'False positive confirmed. The moderation dictionary rule has been corrected and your retry should work now.',
        },
      ],
    },
    {
      id: 1028,
      userName: 'Lena Frost',
      userEmail: 'lena.frost@supportmail.gg',
      subject: 'Match result did not count toward weekly quest',
      category: 'Quest Issue',
      status: 'Open',
      priority: 'Medium',
      date: 'Apr 08, 20:58',
      messages: [
        {
          id: 1,
          author: 'Lena Frost',
          role: 'User',
          time: '20:58',
          message: 'Won a control map but weekly objective still says 2/3. Restarted twice.',
        },
      ],
    },
    {
      id: 1024,
      userName: 'Taro Quinn',
      userEmail: 'taro.quinn@supportmail.gg',
      subject: 'Streamer mode hides party invite buttons',
      category: 'UX Issue',
      status: 'Pending',
      priority: 'Low',
      date: 'Apr 08, 19:11',
      messages: [
        {
          id: 1,
          author: 'Taro Quinn',
          role: 'User',
          time: '19:11',
          message: 'After enabling streamer mode, the party invite controls disappear entirely from the lobby.',
        },
      ],
    },
    {
      id: 1019,
      userName: 'Mina Hart',
      userEmail: 'mina.hart@supportmail.gg',
      subject: 'Refund confirmation email not received',
      category: 'Payment Issue',
      status: 'Closed',
      priority: 'Low',
      date: 'Apr 08, 17:44',
      messages: [
        {
          id: 1,
          author: 'Mina Hart',
          role: 'User',
          time: '17:44',
          message: 'Refund went through in the game client but I never received the confirmation email.',
        },
      ],
    },
    {
      id: 1013,
      userName: 'Noah Vale',
      userEmail: 'noah.vale@supportmail.gg',
      subject: 'Leaderboard page shows empty profile card',
      category: 'Bug Report',
      status: 'In Progress',
      priority: 'Medium',
      date: 'Apr 08, 16:02',
      messages: [
        {
          id: 1,
          author: 'Noah Vale',
          role: 'User',
          time: '16:02',
          message: 'Top 100 leaderboard loads, but selecting any player profile opens a blank overlay.',
        },
      ],
    },
    {
      id: 1008,
      userName: 'Iris Shaw',
      userEmail: 'iris.shaw@supportmail.gg',
      subject: 'Daily reset timer offset by one hour',
      category: 'Live Ops',
      status: 'Resolved',
      priority: 'Low',
      date: 'Apr 08, 14:27',
      messages: [
        {
          id: 1,
          author: 'Iris Shaw',
          role: 'User',
          time: '14:27',
          message: 'My daily missions refresh at 14:00 instead of 13:00 after the DST change.',
        },
      ],
    },
    {
      id: 1003,
      userName: 'Owen Cross',
      userEmail: 'owen.cross@supportmail.gg',
      subject: 'Can not relink Twitch drops account',
      category: 'Account Issue',
      status: 'Pending',
      priority: 'Medium',
      date: 'Apr 08, 12:39',
      messages: [
        {
          id: 1,
          author: 'Owen Cross',
          role: 'User',
          time: '12:39',
          message: 'Unlinked Twitch by mistake and now the relink flow just loops back to account settings.',
        },
      ],
    },
  ]);

  readonly filteredTickets = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    const filter = this.statusFilter();

    return this.tickets().filter((ticket) => {
      const matchesStatus = filter === 'All' || ticket.status === filter;
      if (!matchesStatus) {
        return false;
      }

      if (!query) {
        return true;
      }

      return [
        ticket.id.toString(),
        ticket.userName,
        ticket.userEmail,
        ticket.subject,
        ticket.category,
      ].some((value) => value.toLowerCase().includes(query));
    });
  });

  readonly selectedTicket = computed(() => {
    const selectedId = this.selectedTicketId();
    const filtered = this.filteredTickets();
    const all = this.tickets();

    return (
      filtered.find((ticket) => ticket.id === selectedId) ??
      all.find((ticket) => ticket.id === selectedId) ??
      filtered[0] ??
      all[0] ??
      null
    );
  });
  readonly ticketBody = computed(() => this.selectedTicket()?.messages[0] ?? null);

  updateSearchTerm(value: string): void {
    this.searchTerm.set(value);
  }

  updateStatusFilter(value: string): void {
    this.statusFilter.set(value as 'All' | TicketStatus);
  }

  selectTicket(ticketId: number): void {
    this.selectedTicketId.set(ticketId);
  }

  updateSelectedTicketStatus(status: TicketStatus): void {
    const ticket = this.selectedTicket();

    if (!ticket) {
      return;
    }

    this.updateTicket(ticket.id, { status });
  }

  updateSelectedTicketPriority(priority: TicketPriority): void {
    const ticket = this.selectedTicket();

    if (!ticket) {
      return;
    }

    this.updateTicket(ticket.id, { priority });
  }

  deleteSelectedTicket(): void {
    const ticket = this.selectedTicket();

    if (!ticket) {
      return;
    }

    this.tickets.update((tickets) => tickets.filter((item) => item.id !== ticket.id));
    this.selectedTicketId.set(this.tickets()[0]?.id ?? null);
  }

  updateReplyDraft(value: string): void {
    this.replyDraft.set(value);
  }

  initials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('');
  }

  statusClass(status: TicketStatus): 'open' | 'in-progress' | 'pending' | 'resolved' | 'closed' {
    switch (status) {
      case 'Open':
        return 'open';
      case 'In Progress':
        return 'in-progress';
      case 'Pending':
        return 'pending';
      case 'Resolved':
        return 'resolved';
      default:
        return 'closed';
    }
  }

  priorityClass(priority: TicketPriority): 'low' | 'medium' | 'high' {
    switch (priority) {
      case 'High':
        return 'high';
      case 'Medium':
        return 'medium';
      default:
        return 'low';
    }
  }

  private updateTicket(ticketId: number, patch: Partial<SupportTicket>): void {
    this.tickets.update((tickets) =>
      tickets.map((ticket) => (ticket.id === ticketId ? { ...ticket, ...patch } : ticket))
    );
  }
}
