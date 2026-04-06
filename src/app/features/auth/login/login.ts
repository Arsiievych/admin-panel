import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Logo } from '../../../shared/ui/logo/logo';

@Component({
    selector: 'app-login',
    imports: [
        Logo,
        ReactiveFormsModule,
    ],
    templateUrl: './login.html',
    styleUrl: './login.css',
})
export class Login {
    private readonly formBuilder = inject(FormBuilder);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    readonly isSubmitting = signal(false);
    readonly errorMessage = signal<string | null>(null);

    readonly form = this.formBuilder.nonNullable.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
    });

    submit(): void {
        if (this.form.invalid || this.isSubmitting()) {
            this.form.markAllAsTouched();
            return;
        }

        this.isSubmitting.set(true);
        this.errorMessage.set(null);

        const { email, password } = this.form.getRawValue();

        this.authService.login({ email, password }).subscribe({
            next: () => {
                void this.router.navigate(['/dashboard']);
            },
            error: () => {
                this.errorMessage.set('Invalid email or password.');
                this.isSubmitting.set(false);
            },
        });
    }
}
