import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelListPopupComponent } from './cancel-list-popup.component';

describe('CancelListPopupComponent', () => {
  let component: CancelListPopupComponent;
  let fixture: ComponentFixture<CancelListPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelListPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelListPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
