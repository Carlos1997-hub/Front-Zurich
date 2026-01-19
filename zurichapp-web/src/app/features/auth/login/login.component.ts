import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loading = false;
  error: string | null = null;
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      usernameOrEmail: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  submit(): void {
    this.error = null;
    if (this.form.invalid) return;

    this.loading = true;

    this.auth.login(this.form.getRawValue() as any).subscribe({
      next: (res) => {
        this.loading = false;

        const target =
          res.role === 'Administrador'
            ? '/admin/clients'
            : '/client/policies';

        this.router.navigateByUrl(target, { replaceUrl: true });
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.mensaje ?? 'Credenciales inválidas.';
      }
    });
  }
}
