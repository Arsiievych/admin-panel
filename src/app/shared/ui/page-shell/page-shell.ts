import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-shell',
  imports: [],
  templateUrl: './page-shell.html',
  styleUrl: './page-shell.css',
})
export class PageShell {
  @Input() title = '';
}
