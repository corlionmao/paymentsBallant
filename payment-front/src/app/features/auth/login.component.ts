import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({ selector: 'app-login', standalone: true, imports: [ReactiveFormsModule], templateUrl: './login.component.html', styleUrl: './login.component.css', changeDetection: ChangeDetectionStrategy.OnPush })
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  readonly auth = inject(AuthService);
  readonly form = this.formBuilder.nonNullable.group({ username: ['', Validators.required], password: ['', [Validators.required, Validators.minLength(8)]] });
  isSubmitting = false;

  submit(): void { if (this.form.invalid || this.isSubmitting) { this.form.markAllAsTouched(); return; } this.isSubmitting = true; this.auth.login(this.form.getRawValue()).pipe(finalize(() => this.isSubmitting = false)).subscribe({ next: () => this.router.navigate(['/payments']) }); }
}