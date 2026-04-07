import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageShell } from '../../shared/ui/page-shell/page-shell';

@Component({
  selector: 'app-section-placeholder',
  imports: [PageShell],
  templateUrl: './section-placeholder.html',
  styleUrl: './section-placeholder.css',
})
export class SectionPlaceholder {
  private readonly route = inject(ActivatedRoute);

  readonly title = this.route.snapshot.data['title'] as string;
}
