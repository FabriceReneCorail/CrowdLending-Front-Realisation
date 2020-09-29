import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LMBrefComponent } from './lmbref.component';

describe('LMBrefComponent', () => {
  let component: LMBrefComponent;
  let fixture: ComponentFixture<LMBrefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LMBrefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LMBrefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
