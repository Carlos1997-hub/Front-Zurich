import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientQuotesComponent } from './client-quotes.component';

describe('ClientQuotesComponent', () => {
  let component: ClientQuotesComponent;
  let fixture: ComponentFixture<ClientQuotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientQuotesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
