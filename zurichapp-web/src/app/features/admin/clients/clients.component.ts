import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { ClientsService } from '../../../core/services/clients.service';
import { ClientResponse } from '../../../shared/models/client.models';
import { ModalComponent } from '../../../shared/ui/modal/modal.component';
import { ClientCreateFormComponent } from '../forms/client-create-form/client-create-form.component';
import { ClientEditFormComponent } from '../forms/client-edit-form/client-edit-form.component';
import { PolicyCreateFormComponent } from '../forms/policy-create-form/policy-create-form.component';
import { QuoteCreateFormComponent } from '../forms/quote-create-form/quote-create-form.component';

type ClientFilterField = 'all' | 'identification' | 'name' | 'email' | 'phone';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ModalComponent,
    ClientCreateFormComponent,
    ClientEditFormComponent,
    PolicyCreateFormComponent,
    QuoteCreateFormComponent
  ],
  templateUrl: './clients.component.html'
})
export class ClientsComponent implements OnInit, OnDestroy {
  loading = false;
  error: string | null = null;

  clients: ClientResponse[] = [];
  viewClients: ClientResponse[] = [];

  filterForm: any;

  private destroy$ = new Subject<void>();

  openCreateClient = false;
  openEditClient = false;
  openCreatePolicy = false;
  openCreateQuote = false;

  selectedClientId: number | null = null;
  selectedClient: ClientResponse | null = null;

  openDeleteClient = false;
  deleteTarget: ClientResponse | null = null;
  deleting = false;
  deleteError: string | null = null;

  constructor(
    private clientsService: ClientsService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      q: [''],
      field: ['all' as ClientFilterField],
      onlyActive: [false]
    });
  }

  ngOnInit(): void {
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

    this.clientsService.getAll().subscribe({
      next: (data) => {
        this.clients = data ?? [];
        this.loading = false;
        this.applyFilters();
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.mensaje ?? 'No se pudo cargar la lista de clientes.';
      }
    });
  }

  applyFilters(): void {
    const qRaw = (this.filterForm.value?.q ?? '').toString().trim();
    const q = this.normalize(qRaw);
    const field = (this.filterForm.value?.field ?? 'all') as ClientFilterField;
    const onlyActive = !!this.filterForm.value?.onlyActive;

    let list = [...this.clients];

    if (onlyActive) {
      list = list.filter((c: any) => {
        const v = c?.active ?? c?.activo ?? c?.isActive;
        return v === true || v === 1 || v === '1';
      });
    }

    if (q) {
      list = list.filter((c) => this.matchesClient(c, q, field));
    }

    list.sort((a, b) => (a.fullName ?? '').localeCompare(b.fullName ?? ''));

    this.viewClients = list;
  }

  private matchesClient(c: ClientResponse, q: string, field: ClientFilterField): boolean {
    const id = this.normalize(c.identificationNumber ?? '');
    const name = this.normalize(c.fullName ?? '');
    const email = this.normalize(c.email ?? '');
    const phone = this.normalize(c.phone ?? '');

    switch (field) {
      case 'identification':
        return id.includes(q);
      case 'name':
        return name.includes(q);
      case 'email':
        return email.includes(q);
      case 'phone':
        return phone.includes(q);
      default:
        return (
          id.includes(q) ||
          name.includes(q) ||
          email.includes(q) ||
          phone.includes(q) ||
          this.normalize(String((c as any).clientId ?? '')).includes(q)
        );
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

  clearFilters(): void {
    this.filterForm.patchValue({ q: '', field: 'all', onlyActive: false });
  }

  goPolicies(clientId: number): void {
    this.router.navigate(['/admin/clients', clientId, 'policies']);
  }

  goQuotes(clientId: number): void {
    this.router.navigate(['/admin/clients', clientId, 'quotes']);
  }

  showCreateClient(): void {
    this.openCreateClient = true;
  }

  showEditClient(client: ClientResponse): void {
    this.selectedClient = client;
    this.openEditClient = true;
  }

  showCreatePolicy(client: ClientResponse): void {
    this.selectedClientId = client.clientId;
    this.selectedClient = client;
    this.openCreatePolicy = true;
  }

  showCreateQuote(client: ClientResponse): void {
    this.selectedClientId = client.clientId;
    this.selectedClient = client;
    this.openCreateQuote = true;
  }

  closeAll(): void {
    this.openCreateClient = false;
    this.openEditClient = false;
    this.openCreatePolicy = false;
    this.openCreateQuote = false;
    this.selectedClientId = null;
    this.selectedClient = null;
  }

  onSaved(): void {
    this.closeAll();
    this.load();
  }

  trackByClientId(_index: number, item: ClientResponse): number {
    return item.clientId;
  }

  openDelete(client: ClientResponse): void {
    this.deleteTarget = client;
    this.deleteError = null;
    this.deleting = false;
    this.openDeleteClient = true;
  }

  closeDelete(): void {
    this.openDeleteClient = false;
    this.deleteTarget = null;
    this.deleteError = null;
    this.deleting = false;
  }

  confirmDelete(): void {
    if (!this.deleteTarget || this.deleting) return;

    this.deleting = true;
    this.deleteError = null;

    this.clientsService.delete(this.deleteTarget.clientId).subscribe({
      next: () => {
        this.deleting = false;
        this.closeDelete();
        this.load();
      },
      error: (err) => {
        this.deleting = false;
        this.deleteError = err?.error?.mensaje ?? 'No se pudo eliminar el cliente.';
      }
    });
  }
}
