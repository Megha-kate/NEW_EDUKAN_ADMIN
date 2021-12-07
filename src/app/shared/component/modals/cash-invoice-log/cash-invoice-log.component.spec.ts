import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashInvoiceLogComponent } from './cash-invoice-log.component';

describe('CashInvoiceLogComponent', () => {
  let component: CashInvoiceLogComponent;
  let fixture: ComponentFixture<CashInvoiceLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashInvoiceLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashInvoiceLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
