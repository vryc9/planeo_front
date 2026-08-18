import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from './error-dialog';
import { ErrorView } from '../error';

@Injectable({ providedIn: 'root' })
export class ErrorDialogService {
  private readonly dialog = inject(MatDialog);

  show(data: ErrorView): void {
    this.dialog.open<ErrorDialogComponent, ErrorView, void>(ErrorDialogComponent, {
      data,
      width: '460px',
      autoFocus: false,
    });
  }
}
