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
  private profileSuccessMessageTimeout: ReturnType<typeof setTimeout> | null = null;
  private passwordSuccessMessageTimeout: ReturnType<typeof setTimeout> | null = null;

  readonly profile = this.authService.profile;
  readonly isProfileEditing = signal(false);
  readonly isPasswordEditing = signal(false);
  readonly isLoading = signal(false);
  readonly isProfileSaving = signal(false);
  readonly isPasswordSaving = signal(false);
  readonly pageErrorMessage = signal<string | null>(null);
  readonly profileErrorMessage = signal<string | null>(null);
  readonly profileSuccessMessage = signal<string | null>(null);
  readonly passwordErrorMessage = signal<string | null>(null);
  readonly passwordSuccessMessage = signal<string | null>(null);

  readonly profileForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
  });

  readonly passwordForm = this.formBuilder.nonNullable.group({
    old_password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
    new_password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
    confirm_password: ['', [Validators.required, Validators.maxLength(100)]],
  }, {
    validators: (control): ValidationErrors | null => {
      const oldPassword = control.get('old_password')?.value?.trim() ?? '';
      const newPassword = control.get('new_password')?.value?.trim() ?? '';
      const confirmPassword = control.get('confirm_password')?.value?.trim() ?? '';

      if (newPassword.length < 6) {
        return { newPasswordMinLength: true };
      }

      if (oldPassword.length < 6) {
        return { oldPasswordRequired: true };
      }

      if (!confirmPassword) {
        return { confirmPasswordRequired: true };
      }

      if (confirmPassword !== newPassword) {
        return { passwordMismatch: true };
      }

      return null;
    },
  });

  constructor() {
    this.fillProfileFormFromSession();
    this.clearPasswordForm();
    this.loadProfile();
  }

  ngOnDestroy(): void {
    this.clearProfileSuccessMessageTimeout();
    this.clearPasswordSuccessMessageTimeout();
  }

  startProfileEdit(): void {
    this.profileErrorMessage.set(null);
    this.clearProfileSuccessMessage();
    this.isProfileEditing.set(true);
  }

  cancelProfileEdit(): void {
    this.profileErrorMessage.set(null);
    this.clearProfileSuccessMessage();
    this.fillProfileFormFromSession();
    this.isProfileEditing.set(false);
  }

  saveProfile(): void {
    if (this.profileForm.invalid || this.isProfileSaving()) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isProfileSaving.set(true);
    this.profileErrorMessage.set(null);
    this.clearProfileSuccessMessage();

    this.authService.updateProfile(this.buildProfilePayload()).pipe(
      finalize(() => this.isProfileSaving.set(false)),
    ).subscribe({
      next: () => {
        this.fillProfileFormFromSession();
        this.isProfileEditing.set(false);
        this.setTemporaryProfileSuccessMessage('Profile updated successfully.');
      },
      error: () => {
        this.profileErrorMessage.set('Profile update failed. Check the form and try again.');
      },
    });
  }

  startPasswordEdit(): void {
    this.passwordErrorMessage.set(null);
    this.clearPasswordSuccessMessage();
    this.clearPasswordForm();
    this.isPasswordEditing.set(true);
  }

  cancelPasswordEdit(): void {
    this.passwordErrorMessage.set(null);
    this.clearPasswordSuccessMessage();
    this.clearPasswordForm();
    this.isPasswordEditing.set(false);
  }

  savePassword(): void {
    if (this.passwordForm.invalid || this.isPasswordSaving()) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.isPasswordSaving.set(true);
    this.passwordErrorMessage.set(null);
    this.clearPasswordSuccessMessage();

    this.authService.updateProfile(this.buildPasswordPayload()).pipe(
      finalize(() => this.isPasswordSaving.set(false)),
    ).subscribe({
      next: () => {
        this.clearPasswordForm();
        this.isPasswordEditing.set(false);
        this.setTemporaryPasswordSuccessMessage('Password updated successfully.');
      },
      error: () => {
        this.passwordErrorMessage.set('Password update failed. Check the form and try again.');
      },
    });
  }

  getDisplayName(): string {
    const name = this.profileForm.controls.name.value.trim();
    const email = this.profileForm.controls.email.value.trim();

    return name || this.profile()?.nickname || email || this.profile()?.email || 'Admin';
  }

  getDisplayEmail(): string {
    return this.profileForm.controls.email.value.trim() || this.profile()?.email || 'No email';
  }

  getRoleLabel(): string {
    const role = this.profile()?.role;

    switch (role) {
      case 'SUPER_ADMIN':
        return 'Super Admin';
      case 'ADMIN':
        return 'Admin';
      case 'MODERATOR':
        return 'Moderator';
      case 'USER':
        return 'User';
      default:
        return role ? role.replace(/_/g, ' ') : 'Unknown role';
    }
  }

  getAvatarLetters(): string {
    const parts = this.getDisplayName()
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (parts.length >= 2) {
      return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
    }

    const compactValue = parts.join('').replace(/[^a-zA-Z0-9]+/g, '').toUpperCase();

    return compactValue.slice(0, 2) || 'AD';
  }

  private loadProfile(): void {
    this.isLoading.set(true);
    this.pageErrorMessage.set(null);

    this.authService.getCurrentProfile().pipe(
      finalize(() => this.isLoading.set(false)),
    ).subscribe({
      next: () => this.fillProfileFormFromSession(),
      error: () => {
        this.pageErrorMessage.set('Could not load profile details.');
      },
    });
  }

  private fillProfileFormFromSession(): void {
    const profile = this.authService.profile();

    if (!profile) {
      return;
    }

    this.profileForm.reset({
      name: profile.nickname,
      email: profile.email,
    });
  }

  private clearPasswordForm(): void {
    this.passwordForm.reset({
      old_password: '',
      new_password: '',
      confirm_password: '',
    });
  }

  private buildProfilePayload(): AdminProfileUpdateRequest {
    const value = this.profileForm.getRawValue();

    return {
      name: value.name.trim(),
      email: value.email.trim(),
    };
  }

  private buildPasswordPayload(): AdminProfileUpdateRequest {
    const value = this.passwordForm.getRawValue();

    return {
      old_password: value.old_password.trim(),
      new_password: value.new_password.trim(),
      confirm_password: value.confirm_password.trim(),
    };
  }

  private setTemporaryProfileSuccessMessage(message: string): void {
    this.clearProfileSuccessMessageTimeout();
    this.profileSuccessMessage.set(message);
    this.profileSuccessMessageTimeout = setTimeout(() => {
      this.profileSuccessMessage.set(null);
      this.profileSuccessMessageTimeout = null;
    }, 3000);
  }

  private setTemporaryPasswordSuccessMessage(message: string): void {
    this.clearPasswordSuccessMessageTimeout();
    this.passwordSuccessMessage.set(message);
    this.passwordSuccessMessageTimeout = setTimeout(() => {
      this.passwordSuccessMessage.set(null);
      this.passwordSuccessMessageTimeout = null;
    }, 3000);
  }

  private clearProfileSuccessMessage(): void {
    this.clearProfileSuccessMessageTimeout();
    this.profileSuccessMessage.set(null);
  }

  private clearPasswordSuccessMessage(): void {
    this.clearPasswordSuccessMessageTimeout();
    this.passwordSuccessMessage.set(null);
  }

  private clearProfileSuccessMessageTimeout(): void {
    if (!this.profileSuccessMessageTimeout) {
      return;
    }

    clearTimeout(this.profileSuccessMessageTimeout);
    this.profileSuccessMessageTimeout = null;
  }

  private clearPasswordSuccessMessageTimeout(): void {
    if (!this.passwordSuccessMessageTimeout) {
      return;
    }

    clearTimeout(this.passwordSuccessMessageTimeout);
    this.passwordSuccessMessageTimeout = null;
  }
}
