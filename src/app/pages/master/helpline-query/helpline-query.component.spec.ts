import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelplineQueryComponent } from './helpline-query.component';

describe('HelplineQueryComponent', () => {
  let component: HelplineQueryComponent;
  let fixture: ComponentFixture<HelplineQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelplineQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelplineQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
