import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClientResponse } from '../../shared/models/client.models';

export interface ClientCreateWithUserRequest {
  identificationNumber: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;

  username: string;
  password: string;
  displayName?: string | null;
}

export interface ClientUpdateRequest {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

@Injectable({ providedIn: 'root' })
export class ClientsService {
  private readonly baseUrl = '/api/clients';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ClientResponse[]> {
    return this.http.get<ClientResponse[]>(this.baseUrl);
  }

  createWithUser(body: ClientCreateWithUserRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/with-user`, body);
  }

  update(clientId: number, body: ClientUpdateRequest): Observable<any> {
    return this.http.put(`${this.baseUrl}/${clientId}`, body);
  }

  delete(clientId: number) {
    return this.http.delete(`/api/clients/${clientId}`);
  }
}
