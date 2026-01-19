import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPoliciesComponent } from './client-policies.component';

describe('ClientPoliciesComponent', () => {
  let component: ClientPoliciesComponent;
  let fixture: ComponentFixture<ClientPoliciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientPoliciesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientPoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
