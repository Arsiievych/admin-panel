import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from '../../shared/ui/button/button';

@Component({
  selector: 'app-not-found',
  imports: [
    Button,
  ],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {
  constructor(private readonly router: Router) {}

  goToDashboard(): void {
    void this.router.navigate(['/dashboard']);
  }
}
