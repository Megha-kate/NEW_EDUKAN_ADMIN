import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebRolemasterComponent } from './web-rolemaster.component';

describe('WebRolemasterComponent', () => {
  let component: WebRolemasterComponent;
  let fixture: ComponentFixture<WebRolemasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebRolemasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebRolemasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
