import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDetailPopupComponent } from './payment-detail-popup.component';

describe('PaymentDetailPopupComponent', () => {
  let component: PaymentDetailPopupComponent;
  let fixture: ComponentFixture<PaymentDetailPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentDetailPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentDetailPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
