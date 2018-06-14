import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptOddsModalComponent } from './accept-odds-modal.component';

describe('AcceptOddsModalComponent', () => {
  let component: AcceptOddsModalComponent;
  let fixture: ComponentFixture<AcceptOddsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcceptOddsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptOddsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
