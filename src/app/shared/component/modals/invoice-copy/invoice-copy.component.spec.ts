import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceCopyComponent } from './invoice-copy.component';

describe('InvoiceCopyComponent', () => {
  let component: InvoiceCopyComponent;
  let fixture: ComponentFixture<InvoiceCopyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceCopyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
