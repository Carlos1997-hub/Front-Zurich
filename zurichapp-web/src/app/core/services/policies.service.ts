import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PolicyResponse } from '../../shared/models/policy.models';

export type PolicyType = 'Vida' | 'Automóvil' | 'Salud' | 'Hogar';

export interface PolicyCreateRequest {
  clientId: number;
  policyType: PolicyType;
  startDate: string;
  expirationDate: string;
  insuredAmount: number;
}

@Injectable({ providedIn: 'root' })
export class PoliciesService {
  private readonly baseUrl = '/api/policies';

  constructor(private http: HttpClient) {}

  getByClientId(clientId: number): Observable<PolicyResponse[]> {
    const params = new HttpParams().set('clientId', String(clientId));
    return this.http.get<PolicyResponse[]>(this.baseUrl, { params });
  }

  getMine(): Observable<PolicyResponse[]> {
    return this.http.get<PolicyResponse[]>(`${this.baseUrl}/mine`);
  }

  create(body: PolicyCreateRequest): Observable<any> {
    return this.http.post(this.baseUrl, body);
  }

  cancel(policyId: number) {
    return this.http.patch(`/api/policies/${policyId}/cancel`, {});
  }

}
