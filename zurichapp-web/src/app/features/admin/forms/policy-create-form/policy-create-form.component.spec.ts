import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyCreateFormComponent } from './policy-create-form.component';

describe('PolicyCreateFormComponent', () => {
  let component: PolicyCreateFormComponent;
  let fixture: ComponentFixture<PolicyCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyCreateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
