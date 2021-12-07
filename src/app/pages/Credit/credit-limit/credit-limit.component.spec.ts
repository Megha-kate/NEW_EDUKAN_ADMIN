import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditLimitComponent } from './credit-limit.component';

describe('CreditLimitComponent', () => {
  let component: CreditLimitComponent;
  let fixture: ComponentFixture<CreditLimitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditLimitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
