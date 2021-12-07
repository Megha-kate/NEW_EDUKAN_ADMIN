import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnListsComponent } from './return-lists.component';

describe('ReturnListsComponent', () => {
  let component: ReturnListsComponent;
  let fixture: ComponentFixture<ReturnListsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnListsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
