import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PoliciesService } from '../../../core/services/policies.service';
import { PolicyResponse } from '../../../shared/models/policy.models';

@Component({
  selector: 'app-my-policies',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-policies.component.html'
})
export class MyPoliciesComponent implements OnInit {
  loading = false;
  error: string | null = null;
  policies: PolicyResponse[] = [];

  constructor(private policiesService: PoliciesService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;

    this.policiesService.getMine().subscribe({
      next: (data) => {
        this.policies = data ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.mensaje ?? 'No se pudieron cargar tus pólizas.';
      }
    });
  }
}
