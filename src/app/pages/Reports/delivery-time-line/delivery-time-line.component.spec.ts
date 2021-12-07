import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryTimeLineComponent } from './delivery-time-line.component';

describe('DeliveryTimeLineComponent', () => {
  let component: DeliveryTimeLineComponent;
  let fixture: ComponentFixture<DeliveryTimeLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryTimeLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryTimeLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
