import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuotesService, QuoteCreateRequest } from '../../../../core/services/quotes.service';

@Component({
  selector: 'app-quote-create-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './quote-create-form.component.html'
})
export class QuoteCreateFormComponent {
  @Input({ required: true }) clientId!: number;
  @Output() saved = new EventEmitter<void>();

  loading = false;
  error: string | null = null;
  ok: string | null = null;

  policyTypes = ['Vida', 'Automóvil', 'Salud', 'Hogar'] as const;

  form!: FormGroup;

  constructor(private fb: FormBuilder, private quotesService: QuotesService) {
    this.form = this.fb.group({
      policyType: ['Automóvil', [Validators.required]],
      insuredAmount: [null, [Validators.required, Validators.min(0.01)]],
      termMonths: [12, [Validators.required, Validators.min(1)]],
      monthlyPremium: [null, [Validators.required, Validators.min(0.01)]],
      notes: ['']
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

    const body: QuoteCreateRequest = {
      clientId: this.clientId,
      policyType: this.form.value.policyType,
      insuredAmount: Number(this.form.value.insuredAmount),
      termMonths: Number(this.form.value.termMonths),
      monthlyPremium: Number(this.form.value.monthlyPremium),
      notes: String(this.form.value.notes ?? '')
    };

    this.quotesService.create(body).subscribe({
      next: () => {
        this.loading = false;
        this.ok = 'Cotización creada.';
        this.form.reset({ policyType: 'Automóvil', termMonths: 12 });
        this.saved.emit();
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.mensaje ?? 'Error al crear cotización.';
      }
    });
  }
}
