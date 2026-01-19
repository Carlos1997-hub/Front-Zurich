import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientsService, ClientUpdateRequest } from '../../../../core/services/clients.service';
import { ClientResponse } from '../../../../shared/models/client.models';

@Component({
  selector: 'app-client-edit-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-edit-form.component.html'
})
export class ClientEditFormComponent implements OnChanges {
  @Input({ required: true }) client!: ClientResponse; // lo mandas desde la tabla
  @Output() saved = new EventEmitter<void>();

  loading = false;
  error: string | null = null;
  ok: string | null = null;

  form!: FormGroup;

  constructor(private fb: FormBuilder, private clientsService: ClientsService) {
    this.form = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['client'] && this.client) {
      this.form.patchValue({
        fullName: this.client.fullName ?? '',
        email: this.client.email ?? '',
        phone: this.client.phone ?? '',
        address: this.client.address ?? ''
      });
      this.error = null;
      this.ok = null;
    }
  }

  submit(): void {
    this.error = null;
    this.ok = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const body: ClientUpdateRequest = {
      fullName: String(this.form.value.fullName ?? '').trim(),
      email: String(this.form.value.email ?? '').trim(),
      phone: String(this.form.value.phone ?? '').trim(),
      address: String(this.form.value.address ?? '').trim()
    };

    this.clientsService.update(this.client.clientId, body).subscribe({
      next: () => {
        this.loading = false;
        this.ok = 'Cliente actualizado correctamente.';
        this.saved.emit();
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.mensaje ?? 'Error al actualizar cliente.';
      }
    });
  }
}
