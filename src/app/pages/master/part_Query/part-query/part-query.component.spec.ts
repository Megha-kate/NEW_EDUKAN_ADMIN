import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartQueryComponent } from './part-query.component';

describe('PartQueryComponent', () => {
  let component: PartQueryComponent;
  let fixture: ComponentFixture<PartQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
