import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QuotesService } from '../../../core/services/quotes.service';
import { QuoteResponse } from '../../../shared/models/quote.models';

@Component({
  selector: 'app-my-quotes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-quotes.component.html'
})
export class MyQuotesComponent implements OnInit {
  loading = false;
  error: string | null = null;
  quotes: QuoteResponse[] = [];

  constructor(private quotesService: QuotesService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;

    this.quotesService.getMine().subscribe({
      next: (data) => {
        this.quotes = data ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.mensaje ?? 'No se pudieron cargar tus cotizaciones.';
      }
    });
  }
}
