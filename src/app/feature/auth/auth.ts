import { Component, inject, signal } from '@angular/core';
import { Field, form } from '@angular/forms/signals';
import { injectDispatch } from '@ngrx/signals/events';
import { AuthEvent } from './store/AuthEvent';
import { AuthStore } from './store/AuthStore';

interface LoginData {
  username: string;
  password: string;
}
@Component({
  selector: 'app-auth',
  imports: [Field],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})

export class AuthComponenent {
readonly store = inject(AuthStore);
 loginModel = signal<LoginData>({
  username: '',
  password: '',
});
  form =form(this.loginModel);
  readonly dispatch = injectDispatch(AuthEvent);

  submit() {
    this.dispatch.authentification({
      username: this.form.username().value(),
      password: this.form.password().value(),
    });
  }


}
