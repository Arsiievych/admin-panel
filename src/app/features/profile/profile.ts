import { Component, OnDestroy, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AdminProfileUpdateRequest } from '../../core/models/auth.models';
import { AuthService } from '../../core/services/auth.service';
import { Button } from '../../shared/ui/button/button';
import { PageShell } from '../../shared/ui/page-shell/page-shell';

@Component({
  selector: 'app-profile',
  imports: [
    Button,
    PageShell,
    ReactiveFormsModule,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private successMessageTimeout: ReturnType<typeof setTimeout> | null = null;

  readonly isEditing = signal(false);
  readonly isLoading = signal(false);
  readonly isSaving = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
    old_password: ['', [Validators.maxLength(100)]],
    new_password: ['', [Validators.maxLength(100)]],
    confirm_password: ['', [Validators.maxLength(100)]],
  }, {
    validators: (control): ValidationErrors | null => {
      const oldPassword = control.get('old_password')?.value?.trim() ?? '';
      const newPassword = control.get('new_password')?.value?.trim() ?? '';
      const confirmPassword = control.get('confirm_password')?.value?.trim() ?? '';

      if (!oldPassword && !newPassword && !confirmPassword) {
        return null;
      }

      if (newPassword.length < 8) {
        return { newPasswordMinLength: true };
      }

      if (oldPassword.length < 8) {
        return { oldPasswordRequired: true };
      }

      if (confirmPassword !== newPassword) {
        return { passwordMismatch: true };
      }

      return null;
    },
  });

  constructor() {
    this.fillFormFromSession();
    this.loadProfile();
  }

  ngOnDestroy(): void {
    this.clearSuccessMessageTimeout();
  }

  startEdit(): void {
    this.errorMessage.set(null);
    this.clearSuccessMessage();
    this.isEditing.set(true);
  }

  cancelEdit(): void {
    this.errorMessage.set(null);
    this.clearSuccessMessage();
    this.fillFormFromSession();
    this.isEditing.set(false);
  }

  save(): void {
    if (this.form.invalid || this.isSaving()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set(null);
    this.clearSuccessMessage();

    this.authService.updateProfile(this.buildPayload()).pipe(
      finalize(() => this.isSaving.set(false)),
    ).subscribe({
      next: () => {
        this.fillFormFromSession();
        this.isEditing.set(false);
        this.setTemporarySuccessMessage('Profile updated successfully.');
      },
      error: () => {
        this.errorMessage.set('Profile update failed. Check the form and try again.');
      },
    });
  }

  private loadProfile(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.getCurrentProfile().pipe(
      finalize(() => this.isLoading.set(false)),
    ).subscribe({
      next: () => this.fillFormFromSession(),
      error: () => {
        this.errorMessage.set('Could not load profile details.');
      },
    });
  }

  private fillFormFromSession(): void {
    const profile = this.authService.profile();

    if (!profile) {
      return;
    }

    this.form.reset({
      name: profile.nickname,
      email: profile.email,
      old_password: '',
      new_password: '',
      confirm_password: '',
    });
  }

  private setTemporarySuccessMessage(message: string): void {
    this.clearSuccessMessageTimeout();
    this.successMessage.set(message);
    this.successMessageTimeout = setTimeout(() => {
      this.successMessage.set(null);
      this.successMessageTimeout = null;
    }, 3000);
  }

  private clearSuccessMessage(): void {
    this.clearSuccessMessageTimeout();
    this.successMessage.set(null);
  }

  private clearSuccessMessageTimeout(): void {
    if (!this.successMessageTimeout) {
      return;
    }

    clearTimeout(this.successMessageTimeout);
    this.successMessageTimeout = null;
  }

  private buildPayload(): AdminProfileUpdateRequest {
    const value = this.form.getRawValue();
    const payload: AdminProfileUpdateRequest = {
      name: value.name.trim(),
      email: value.email.trim(),
    };

    if (value.new_password.trim()) {
      payload.old_password = value.old_password;
      payload.new_password = value.new_password;
      payload.confirm_password = value.confirm_password;
    }

    return payload;
  }
}
