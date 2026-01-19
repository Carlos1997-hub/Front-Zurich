import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoginResponse } from '../../shared/models/auth.models';

const KEY_TOKEN = 'zurich_token';
const KEY_USER = 'zurich_user';

export type StoredUser = Pick<
  LoginResponse,
  'userId' | 'role' | 'clientId' | 'displayName' | 'email' | 'username'
>;

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly _user$ = new BehaviorSubject<StoredUser | null>(this.readUser());
  readonly user$ = this._user$.asObservable();

  private readonly _token$ = new BehaviorSubject<string | null>(this.readToken());
  readonly token$ = this._token$.asObservable();

  setSession(res: LoginResponse): void {
    localStorage.setItem(KEY_TOKEN, res.accessToken);

    const user: StoredUser = {
      userId: res.userId,
      role: res.role,
      clientId: res.clientId,
      displayName: res.displayName,
      email: res.email,
      username: res.username
    };

    localStorage.setItem(KEY_USER, JSON.stringify(user));

    this._token$.next(res.accessToken);
    this._user$.next(user);
  }

  clear(): void {
    localStorage.removeItem(KEY_TOKEN);
    localStorage.removeItem(KEY_USER);
    this._token$.next(null);
    this._user$.next(null);
  }

  isLoggedIn(): boolean {
    const t = this._token$.value;
    return !!(t && t.trim().length > 0);
  }

  getToken(): string | null {
    return this._token$.value;
  }

  getUser(): StoredUser | null {
    return this._user$.value;
  }

  syncFromStorage(): void {
    this._token$.next(this.readToken());
    this._user$.next(this.readUser());
  }

  private readToken(): string | null {
    const t = localStorage.getItem(KEY_TOKEN);
    return t && t.trim().length ? t : null;
  }

  private readUser(): StoredUser | null {
    const raw = localStorage.getItem(KEY_USER);
    if (!raw) return null;
    try { return JSON.parse(raw) as StoredUser; } catch { return null; }
  }
}
