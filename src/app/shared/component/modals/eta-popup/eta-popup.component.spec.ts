import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtaPopupComponent } from './eta-popup.component';

describe('EtaPopupComponent', () => {
  let component: EtaPopupComponent;
  let fixture: ComponentFixture<EtaPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtaPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtaPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
