import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfodetailpopupComponent } from './infodetailpopup.component';

describe('InfodetailpopupComponent', () => {
  let component: InfodetailpopupComponent;
  let fixture: ComponentFixture<InfodetailpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfodetailpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfodetailpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
