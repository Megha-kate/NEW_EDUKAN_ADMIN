import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FailOrderPopupComponent } from './fail-order-popup.component';

describe('FailOrderPopupComponent', () => {
  let component: FailOrderPopupComponent;
  let fixture: ComponentFixture<FailOrderPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FailOrderPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FailOrderPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
