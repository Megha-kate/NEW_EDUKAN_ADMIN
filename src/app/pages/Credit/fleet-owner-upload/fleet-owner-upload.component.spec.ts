import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetOwnerUploadComponent } from './fleet-owner-upload.component';

describe('FleetOwnerUploadComponent', () => {
  let component: FleetOwnerUploadComponent;
  let fixture: ComponentFixture<FleetOwnerUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetOwnerUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetOwnerUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
