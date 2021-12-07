import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoDetailsComponent } from './po-details.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


describe('PoDetailsComponent', () => {
  let component: PoDetailsComponent;
  let fixture: ComponentFixture<PoDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoDetailsComponent ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
