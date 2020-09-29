import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LendMeEnBrefComponent } from './lend-me-en-bref.component';

describe('LendMeEnBrefComponent', () => {
  let component: LendMeEnBrefComponent;
  let fixture: ComponentFixture<LendMeEnBrefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LendMeEnBrefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LendMeEnBrefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
