import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-navigation-item',
  imports: [],
  templateUrl: './navigation-item.html',
  styleUrl: './navigation-item.css',
})
export class NavigationItem {
  @Input() label = '';
  @Input() active = false;
  @Input() muted = false;
}
