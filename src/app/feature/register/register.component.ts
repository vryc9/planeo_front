import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormField, form, maxLength, minLength, pattern, required, submit, validate } from '@angular/forms/signals';
import { injectDispatch } from '@ngrx/signals/events';
import { InvitationEvents, RegisterEvents } from './store/RegisterEvent';
import { RegisterStore } from './store/RegisterStore';

interface RegisterFormData {
  username: string;
  password: string;
  confirmPassword: string;
}

const USERNAME_PATTERN = /^[a-zA-Z0-9_.-]{3,30}$/;

@Component({
  selector: 'app-register',
  imports: [FormField, RouterLink],
  providers: [RegisterStore],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly invitationDispatch = injectDispatch(InvitationEvents);
  private readonly dispatch = injectDispatch(RegisterEvents);
  readonly store = inject(RegisterStore);

  private readonly token = signal<string | null>(null);
  readonly hasToken = computed(() => this.token() !== null);

  registerModel = signal<RegisterFormData>({ username: '', password: '', confirmPassword: '' });

  form = form(this.registerModel, (schemaPath) => {
    required(schemaPath.username, { message: "Le nom d'utilisateur est obligatoire" });
    pattern(schemaPath.username, USERNAME_PATTERN, {
      message: '3 à 30 caractères : lettres, chiffres, points, underscores ou tirets',
    });
    required(schemaPath.password, { message: 'Le mot de passe est obligatoire' });
    minLength(schemaPath.password, 12, { message: 'Le mot de passe doit contenir au moins 12 caractères' });
    maxLength(schemaPath.password, 128, { message: 'Le mot de passe ne doit pas dépasser 128 caractères' });
    required(schemaPath.confirmPassword, { message: 'Merci de confirmer le mot de passe' });
    validate(schemaPath.confirmPassword, ({ value, valueOf }) =>
      value() === valueOf(schemaPath.password)
        ? undefined
        : { kind: 'passwordMismatch', message: 'Les mots de passe ne correspondent pas' },
    );
  });

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    this.token.set(token);
    if (token) {
      this.invitationDispatch.validateInvitation({ token });
    }
  }

  submit(): void {
    const token = this.token();
    if (!token) {
      return;
    }
    submit(this.form, async () => {
      this.dispatch.register({
        token,
        username: this.form.username().value(),
        password: this.form.password().value(),
      });
    });
  }
}
