import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountMasterPopupComponent } from './discount-master-popup.component';

describe('DiscountMasterPopupComponent', () => {
  let component: DiscountMasterPopupComponent;
  let fixture: ComponentFixture<DiscountMasterPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountMasterPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountMasterPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
