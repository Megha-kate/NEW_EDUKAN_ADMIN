import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRolemasterComponent } from './admin-rolemaster.component';

describe('AdminRolemasterComponent', () => {
  let component: AdminRolemasterComponent;
  let fixture: ComponentFixture<AdminRolemasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminRolemasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRolemasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
