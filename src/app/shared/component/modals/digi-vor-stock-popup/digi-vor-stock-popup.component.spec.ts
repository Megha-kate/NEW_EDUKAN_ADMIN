import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigiVorStockPopupComponent } from './digi-vor-stock-popup.component';

describe('DigiVorStockPopupComponent', () => {
  let component: DigiVorStockPopupComponent;
  let fixture: ComponentFixture<DigiVorStockPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigiVorStockPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigiVorStockPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
