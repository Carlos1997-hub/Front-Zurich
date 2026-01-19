export type QuoteType = 'Vida' | 'Automóvil' | 'Salud' | 'Hogar';
export type QuoteStatus = 'Generada' | 'Enviada' | 'Aceptada' | 'Rechazada' | 'Expirada';

export interface QuoteResponse {
  quoteId: number;
  clientId: number;
  policyType: QuoteType;
  insuredAmount: number;
  termMonths: number;
  monthlyPremium: number;
  quoteStatus: QuoteStatus;
  notes?: string | null;
  createdAt: string;
}
