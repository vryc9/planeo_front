import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorView } from '../error';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.html',
  styleUrl: './error-dialog.css',
})
export class ErrorDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<ErrorDialogComponent, void>);
  protected readonly data = inject<ErrorView>(MAT_DIALOG_DATA);

  protected close(): void {
    this.dialogRef.close();
  }
}
