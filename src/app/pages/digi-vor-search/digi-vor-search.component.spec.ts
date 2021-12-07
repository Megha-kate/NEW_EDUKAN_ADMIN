import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigiVorSearchComponent } from './digi-vor-search.component';

describe('DigiVorSearchComponent', () => {
  let component: DigiVorSearchComponent;
  let fixture: ComponentFixture<DigiVorSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigiVorSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigiVorSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
