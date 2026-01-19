import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidationErrors
} from '@angular/forms';
import { PoliciesService, PolicyCreateRequest } from '../../../../core/services/policies.service';

function dateRangeValidator(group: AbstractControl): ValidationErrors | null {
  const start = group.get('startDate')?.value;
  const end = group.get('expirationDate')?.value;

  if (!start || !end) return null;

  const s = new Date(start);
  const e = new Date(end);

  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return null;

  return e >= s ? null : { dateRange: true };
}

@Component({
  selector: 'app-policy-create-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './policy-create-form.component.html'
})
export class PolicyCreateFormComponent {
  @Input({ required: true }) clientId!: number;
  @Output() saved = new EventEmitter<void>();

  loading = false;
  error: string | null = null;
  ok: string | null = null;

  policyTypes = ['Vida', 'Automóvil', 'Salud', 'Hogar'] as const;

  form!: FormGroup;

  constructor(private fb: FormBuilder, private policiesService: PoliciesService) {
    this.form = this.fb.group(
      {
        policyType: ['Vida', [Validators.required]],
        startDate: ['', [Validators.required]],
        expirationDate: ['', [Validators.required]],
        insuredAmount: [null, [Validators.required, Validators.min(0.01)]]
      },
      { validators: [dateRangeValidator] }
    );
  }

  submit(): void {
    this.error = null;
    this.ok = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const body: PolicyCreateRequest = {
      clientId: this.clientId,
      policyType: this.form.value.policyType,
      startDate: String(this.form.value.startDate ?? ''),
      expirationDate: String(this.form.value.expirationDate ?? ''),
      insuredAmount: Number(this.form.value.insuredAmount)
    };

    this.policiesService.create(body).subscribe({
      next: () => {
        this.loading = false;
        this.ok = 'Póliza creada.';
        this.form.reset({ policyType: '' });
        this.saved.emit();
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.mensaje ?? 'Error al crear póliza.';
      }
    });
  }
}
