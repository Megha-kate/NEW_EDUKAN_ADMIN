import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtaListComponent } from './eta-list.component';

describe('EtaListComponent', () => {
  let component: EtaListComponent;
  let fixture: ComponentFixture<EtaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
