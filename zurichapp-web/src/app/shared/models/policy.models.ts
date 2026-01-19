export type PolicyType = 'Vida' | 'Automóvil' | 'Salud' | 'Hogar';
export type PolicyStatus = 'Activa' | 'Cancelada';

export interface PolicyResponse {
  policyId: number;
  clientId: number;
  createdByUserId: number;
  policyType: PolicyType;
  startDate: string;
  expirationDate: string;
  insuredAmount: number;
  policyStatus: PolicyStatus;
  assignedAt: string;
}
