import { Component, Input } from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-navigation-item',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navigation-item.html',
  styleUrl: './navigation-item.css',
})
export class NavigationItem {
  @Input() label = '';
  @Input() icon = '';
  @Input() collapsed = false;
  @Input() muted = false;
  @Input() path = <string[]>[];

  get iconClass(): string {
    return `fi ${this.icon}`.trim();
  }
}
