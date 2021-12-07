import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceLevelMisComponent } from './invoice-level-mis.component';

describe('InvoiceLevelMisComponent', () => {
  let component: InvoiceLevelMisComponent;
  let fixture: ComponentFixture<InvoiceLevelMisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceLevelMisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceLevelMisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
