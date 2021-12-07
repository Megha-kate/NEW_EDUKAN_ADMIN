import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeLineInvoiceComponent } from './time-line-invoice.component';

describe('TimeLineInvoiceComponent', () => {
  let component: TimeLineInvoiceComponent;
  let fixture: ComponentFixture<TimeLineInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeLineInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeLineInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
