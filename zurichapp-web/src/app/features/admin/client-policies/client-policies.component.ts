import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

import { PoliciesService } from '../../../core/services/policies.service';
import { PolicyResponse } from '../../../shared/models/policy.models';
import { ModalComponent } from '../../../shared/ui/modal/modal.component';
import { PolicyCreateFormComponent } from '../forms/policy-create-form/policy-create-form.component';

type PolicyFilterField = 'all' | 'id' | 'type' | 'status';

@Component({
  selector: 'app-client-policies',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ModalComponent, PolicyCreateFormComponent],
  templateUrl: './client-policies.component.html'
})
export class ClientPoliciesComponent implements OnInit, OnDestroy {
  clientId = 0;

  loading = false;
  error: string | null = null;

  policies: PolicyResponse[] = [];
  viewPolicies: PolicyResponse[] = [];

  filterForm: any;

  private destroy$ = new Subject<void>();

  openCancelPolicy = false;
  cancelPolicyId: number | null = null;
  cancelStatus: string | null = null;

  canceling = false;
  cancelError: string | null = null;

  openCreatePolicy = false;

  constructor(
    private route: ActivatedRoute,
    private policiesService: PoliciesService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      q: [''],
      field: ['all' as PolicyFilterField],
      status: ['all'],
      from: [''],
      to: ['']
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

    this.policiesService.getByClientId(this.clientId).subscribe({
      next: (data) => {
        this.policies = data ?? [];
        this.loading = false;
        this.applyFilters();
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.mensaje ?? 'No se pudieron cargar las pólizas del cliente.';
      }
    });
  }

  showCreatePolicy(): void {
    this.openCreatePolicy = true;
  }

  closeCreatePolicy(): void {
    this.openCreatePolicy = false;
  }

  onSavedPolicy(): void {
    this.closeCreatePolicy();
    this.load();
  }

  applyFilters(): void {
    const qRaw = (this.filterForm.value?.q ?? '').toString().trim();
    const q = this.normalize(qRaw);
    const field = (this.filterForm.value?.field ?? 'all') as PolicyFilterField;

    const status = (this.filterForm.value?.status ?? 'all').toString();
    const from = this.toDateOnly(this.filterForm.value?.from);
    const to = this.toDateOnly(this.filterForm.value?.to);

    let list = [...this.policies];

    if (q) {
      list = list.filter((p) => this.matchesPolicy(p, q, field));
    }

    if (status !== 'all') {
      list = list.filter((p) => (p.policyStatus ?? '') === status);
    }

    if (from) {
      list = list.filter((p) => {
        const sd = this.toDateOnly(p.startDate);
        return sd ? sd.getTime() >= from.getTime() : false;
      });
    }

    if (to) {
      list = list.filter((p) => {
        const ed = this.toDateOnly(p.expirationDate);
        return ed ? ed.getTime() <= to.getTime() : false;
      });
    }

    list.sort((a, b) => (a.policyId ?? 0) - (b.policyId ?? 0));

    this.viewPolicies = list;
  }

  private matchesPolicy(p: PolicyResponse, q: string, field: PolicyFilterField): boolean {
    const id = this.normalize(String((p as any).policyId ?? ''));
    const type = this.normalize((p as any).policyType ?? '');
    const status = this.normalize((p as any).policyStatus ?? '');

    switch (field) {
      case 'id':
        return id.includes(q);
      case 'type':
        return type.includes(q);
      case 'status':
        return status.includes(q);
      default:
        return id.includes(q) || type.includes(q) || status.includes(q);
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

  private toDateOnly(value: any): Date | null {
    if (!value) return null;
    const d = new Date(value);
    if (isNaN(d.getTime())) return null;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  getStatusOptions(): string[] {
    const set = new Set<string>();
    for (const p of this.policies) {
      const s = (p.policyStatus ?? '').toString().trim();
      if (s) set.add(s);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }

  clearFilters(): void {
    this.filterForm.patchValue({ q: '', field: 'all', status: 'all', from: '', to: '' });
  }

  openCancel(p: PolicyResponse): void {
    this.cancelPolicyId = p.policyId;
    this.cancelStatus = p.policyStatus ?? null;
    this.cancelError = null;
    this.canceling = false;
    this.openCancelPolicy = true;
  }

  closeCancel(): void {
    this.openCancelPolicy = false;
    this.cancelPolicyId = null;
    this.cancelStatus = null;
    this.cancelError = null;
    this.canceling = false;
  }

  confirmCancel(): void {
    if (!this.cancelPolicyId || this.canceling) return;

    this.canceling = true;
    this.cancelError = null;

    this.policiesService.cancel(this.cancelPolicyId).subscribe({
      next: () => {
        this.canceling = false;
        this.closeCancel();
        this.load();
      },
      error: (err) => {
        this.canceling = false;
        this.cancelError = err?.error?.mensaje ?? 'No se pudo cancelar la póliza.';
      }
    });
  }
}
