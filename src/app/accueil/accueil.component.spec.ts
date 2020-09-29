import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { AccueilComponent } from './accueil.component';
import { HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { apiHttpSpringBootService } from '../api-spring-boot.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'; // module translation
import { TranslateHttpLoader } from '@ngx-translate/http-loader';  // module translation
import { Type } from '@angular/core';
import { httpTranslateLoader } from '../app.module';
import { HttpClient } from '@angular/common/http';
export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}


describe('AccueilComponent', () => {


    let fixture: ComponentFixture<AccueilComponent>;
    let app;
    let myService: apiHttpSpringBootService;
    let httpMock: HttpTestingController;


    beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        HttpClientTestingModule,
        FormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: httpTranslateLoader,
            deps: [HttpClient]
          }
        }),
      ],
      providers: [{ provide: 'BASE_URL', useFactory: getBaseUrl }, DatePipe],
      declarations: [
        AccueilComponent
      ],
    }).compileComponents();

    myService = TestBed.inject(apiHttpSpringBootService);

    }));

    beforeEach(() => {
       fixture = TestBed.createComponent(AccueilComponent);
       app = fixture.componentInstance;

       httpMock = fixture.debugElement.injector.get<HttpTestingController>(HttpTestingController as Type<HttpTestingController>);

       fixture.detectChanges();
    });

    it('should create the component-Accueil', () => {

       expect(app).toBeTruthy();

    });



});


