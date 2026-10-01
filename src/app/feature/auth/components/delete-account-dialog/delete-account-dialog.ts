import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { injectDispatch } from '@ngrx/signals/events';
import { concat, finalize } from 'rxjs';
import { AuthService } from '../../service/auth-service.service';
import { AuthEvent } from '../../store/AuthEvent';
import { ErrorDetail } from '../../../../shared/error/error-detail.interceptor';

/**
 * Account deletion needs a recent password confirmation: the password is first checked through
 * /auth/reauth, then the deletion itself is requested. Errors are shown inline, not globally.
 */
@Component({
  selector: 'app-delete-account-dialog',
  imports: [MatDialogModule, FormsModule],
  templateUrl: './delete-account-dialog.html',
  styleUrl: './delete-account-dialog.css',
})
export class DeleteAccountDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<DeleteAccountDialogComponent, boolean>);
  private readonly authService = inject(AuthService);
  private readonly dispatch = injectDispatch(AuthEvent);

  protected readonly password = signal('');
  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected cancel(): void {
    this.dialogRef.close(false);
  }

  protected submit(): void {
    if (!this.password() || this.isSubmitting()) {
      return;
    }
    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    concat(
      this.authService.reauth(this.password()),
      this.authService.deleteAccount(),
    )
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        complete: () => {
          this.dialogRef.close(true);
          this.dispatch.accountDeleted();
        },
        error: (error: unknown) => this.errorMessage.set(this.toMessage(error)),
      });
  }

  private toMessage(error: unknown): string {
    // errorDetailInterceptor rewrites failures into ErrorDetail (status 401 on reauth = bad password).
    const status = (error as Partial<ErrorDetail>)?.status;
    if (status === 401) {
      return 'Mot de passe incorrect.';
    }
    if (status === 403) {
      return 'Confirmation du mot de passe expirée, merci de réessayer.';
    }
    return (error as Partial<ErrorDetail>)?.detail ?? 'Une erreur est survenue, merci de réessayer.';
  }
}
