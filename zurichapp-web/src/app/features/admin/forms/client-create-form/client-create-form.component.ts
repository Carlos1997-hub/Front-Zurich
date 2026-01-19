import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientsService, ClientCreateWithUserRequest } from '../../../../core/services/clients.service';

@Component({
  selector: 'app-client-create-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-create-form.component.html'
})
export class ClientCreateFormComponent {
  @Output() saved = new EventEmitter<void>();

  loading = false;
  error: string | null = null;
  ok: string | null = null;

  form!: FormGroup;

  constructor(private fb: FormBuilder, private clientsService: ClientsService) {
    this.form = this.fb.group({
      identificationNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],

      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      displayName: ['']
    });
  }

  submit(): void {
    this.error = null;
    this.ok = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const body: ClientCreateWithUserRequest = {
      identificationNumber: String(this.form.value.identificationNumber ?? '').trim(),
      fullName: String(this.form.value.fullName ?? '').trim(),
      email: String(this.form.value.email ?? '').trim(),
      phone: String(this.form.value.phone ?? '').trim(),
      address: String(this.form.value.address ?? '').trim(),
      username: String(this.form.value.username ?? '').trim(),
      password: String(this.form.value.password ?? ''),
      displayName: String(this.form.value.displayName ?? '').trim()
    };

    this.clientsService.createWithUser(body).subscribe({
      next: () => {
        this.loading = false;
        this.ok = 'Cliente creado correctamente.';
        this.form.reset();
        this.saved.emit();
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.mensaje ?? 'Error al crear cliente.';
      }
    });
  }
}
