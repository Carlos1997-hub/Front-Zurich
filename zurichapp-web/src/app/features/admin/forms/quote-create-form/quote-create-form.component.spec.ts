import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteCreateFormComponent } from './quote-create-form.component';

describe('QuoteCreateFormComponent', () => {
  let component: QuoteCreateFormComponent;
  let fixture: ComponentFixture<QuoteCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteCreateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuoteCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
