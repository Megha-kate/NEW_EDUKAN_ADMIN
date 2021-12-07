import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerListPopupComponent } from './customer-list-popup.component';

describe('CustomerListPopupComponent', () => {
  let component: CustomerListPopupComponent;
  let fixture: ComponentFixture<CustomerListPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerListPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerListPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
