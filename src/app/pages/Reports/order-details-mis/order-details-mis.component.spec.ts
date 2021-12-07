import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailsMisComponent } from './order-details-mis.component';

describe('OrderDetailsMisComponent', () => {
  let component: OrderDetailsMisComponent;
  let fixture: ComponentFixture<OrderDetailsMisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDetailsMisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailsMisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
