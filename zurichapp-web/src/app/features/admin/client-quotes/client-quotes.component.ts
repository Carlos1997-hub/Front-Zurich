import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

import { QuotesService } from '../../../core/services/quotes.service';
import { QuoteResponse } from '../../../shared/models/quote.models';

import { ModalComponent } from '../../../shared/ui/modal/modal.component';
import { QuoteCreateFormComponent } from '../forms/quote-create-form/quote-create-form.component';

type QuoteFilterField = 'all' | 'id' | 'type' | 'status' | 'notes';

@Component({
  selector: 'app-client-quotes',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ModalComponent, QuoteCreateFormComponent],
  templateUrl: './client-quotes.component.html'
})
export class ClientQuotesComponent implements OnInit, OnDestroy {
  clientId = 0;

  loading = false;
  error: string | null = null;

  quotes: QuoteResponse[] = [];
  viewQuotes: QuoteResponse[] = [];

  filterForm: any;

  private destroy$ = new Subject<void>();

  openCreateQuote = false;

  constructor(
    private route: ActivatedRoute,
    private quotesService: QuotesService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      q: [''],
      field: ['all' as QuoteFilterField],
      status: ['all']
    });
  }

  ngOnInit(): void {
    this.clientId = Number(this.route.snapshot.paramMap.get('clientId') ?? '0');

    this.filterForm.valueChanges
      .pipe(
        debounceTime(250),
        distinctUntilChanged((a: any, b: any) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.applyFilters());

    this.load();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load(): void {
    this.loading = true;
    this.error = null;

    this.quotesService.getByClientId(this.clientId).subscribe({
      next: (data) => {
        this.quotes = data ?? [];
        this.loading = false;
        this.applyFilters();
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.mensaje ?? 'No se pudieron cargar las cotizaciones del cliente.';
      }
    });
  }

  showCreateQuote(): void {
    this.openCreateQuote = true;
  }

  closeCreateQuote(): void {
    this.openCreateQuote = false;
  }

  onSavedQuote(): void {
    this.closeCreateQuote();
    this.load();
  }

  applyFilters(): void {
    const qRaw = (this.filterForm.value?.q ?? '').toString().trim();
    const q = this.normalize(qRaw);
    const field = (this.filterForm.value?.field ?? 'all') as QuoteFilterField;
    const status = (this.filterForm.value?.status ?? 'all').toString();

    let list = [...this.quotes];

    if (status !== 'all') {
      list = list.filter((x) => (x.quoteStatus ?? '') === status);
    }

    if (q) {
      list = list.filter((x) => this.matchesQuote(x, q, field));
    }

    list.sort((a, b) => (b.quoteId ?? 0) - (a.quoteId ?? 0));

    this.viewQuotes = list;
  }

  private matchesQuote(x: QuoteResponse, q: string, field: QuoteFilterField): boolean {
    const id = this.normalize(String((x as any).quoteId ?? ''));
    const type = this.normalize((x as any).policyType ?? '');
    const status = this.normalize((x as any).quoteStatus ?? '');
    const notes = this.normalize((x as any).notes ?? '');

    switch (field) {
      case 'id':
        return id.includes(q);
      case 'type':
        return type.includes(q);
      case 'status':
        return status.includes(q);
      case 'notes':
        return notes.includes(q);
      default:
        return id.includes(q) || type.includes(q) || status.includes(q) || notes.includes(q);
    }
  }

  private normalize(value: string): string {
    return (value ?? '')
      .toString()
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  getStatusOptions(): string[] {
    const set = new Set<string>();
    for (const q of this.quotes) {
      const s = (q.quoteStatus ?? '').toString().trim();
      if (s) set.add(s);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }

  clearFilters(): void {
    this.filterForm.patchValue({ q: '', field: 'all', status: 'all' });
  }
}
