import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancleListComponent } from './cancle-list.component';

describe('CancleListComponent', () => {
  let component: CancleListComponent;
  let fixture: ComponentFixture<CancleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancleListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
