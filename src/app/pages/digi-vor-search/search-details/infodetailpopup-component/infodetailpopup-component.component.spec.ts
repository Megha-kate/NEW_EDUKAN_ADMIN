import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfodetailpopupComponentComponent } from './infodetailpopup-component.component';

describe('InfodetailpopupComponentComponent', () => {
  let component: InfodetailpopupComponentComponent;
  let fixture: ComponentFixture<InfodetailpopupComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfodetailpopupComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfodetailpopupComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
