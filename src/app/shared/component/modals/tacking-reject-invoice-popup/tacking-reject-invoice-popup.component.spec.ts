import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TackingRejectInvoicePopupComponent } from './tacking-reject-invoice-popup.component';

describe('TackingRejectInvoicePopupComponent', () => {
  let component: TackingRejectInvoicePopupComponent;
  let fixture: ComponentFixture<TackingRejectInvoicePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TackingRejectInvoicePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TackingRejectInvoicePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
