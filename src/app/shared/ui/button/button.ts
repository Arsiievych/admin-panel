import { Component, input, output } from '@angular/core';

type ButtonType = 'button' | 'submit' | 'reset';
type ButtonVariant = 'primary' | 'ghost';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css',
  host: {
    '[class.button-host--full-width]': 'fullWidth()',
  },
})
export class Button {
  readonly type = input<ButtonType>('button');
  readonly variant = input<ButtonVariant>('primary');
  readonly icon = input<string | null>(null);
  readonly disabled = input(false);
  readonly fullWidth = input(false);
  readonly ariaLabel = input<string | null>(null);

  readonly pressed = output<MouseEvent>();
}
