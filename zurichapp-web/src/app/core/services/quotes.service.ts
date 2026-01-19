import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuoteResponse } from '../../shared/models/quote.models';

export type QuoteType = 'Vida' | 'Automóvil' | 'Salud' | 'Hogar';

export interface QuoteCreateRequest {
  clientId: number;
  policyType: QuoteType;
  insuredAmount: number;
  termMonths: number;
  monthlyPremium: number;
  notes?: string | null;
}

@Injectable({ providedIn: 'root' })
export class QuotesService {
  private readonly baseUrl = '/api/quotes';

  constructor(private http: HttpClient) {}

  getByClientId(clientId: number): Observable<QuoteResponse[]> {
    const params = new HttpParams().set('clientId', String(clientId));
    return this.http.get<QuoteResponse[]>(this.baseUrl, { params });
  }

  getMine(): Observable<QuoteResponse[]> {
    return this.http.get<QuoteResponse[]>(`${this.baseUrl}/mine`);
  }

  create(body: QuoteCreateRequest): Observable<any> {
    return this.http.post(this.baseUrl, body);
  }
}
