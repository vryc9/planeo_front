import { Component, inject } from '@angular/core';
import { injectDispatch } from '@ngrx/signals/events';
import { ToastEvents } from './store/toastEvents';
import { ToastStore } from './store/toastStore';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class ToastComponent {
  protected readonly store = inject(ToastStore);
  private readonly dispatch = injectDispatch(ToastEvents);

  protected close(): void {
    this.dispatch.hide();
  }
}
