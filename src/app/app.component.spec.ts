import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { IdentificationComponent } from './identification/identification.component';
import { RouterTestingModule } from '@angular/router/testing';


describe('AppComponent', () => {

  // tslint:disable-next-line:one-variable-per-declaration
  let fixture, app;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent, IdentificationComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
     fixture = TestBed.createComponent(AppComponent);
     app = fixture.componentInstance;
     expect(app).toBeTruthy();
  });


 /* it(`should have as title 'crowdfunding-frond-end'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('crowdfunding-frond-end');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('crowdfunding-frond-end app is running!');
  }); */
});
