import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'; // module translation
import { TranslateHttpLoader } from '@ngx-translate/http-loader';  // module translation
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service'; // https://www.npmjs.com/package/ngx-cookie-service
import { RoutingModule } from './app-routing.module';
// tslint:disable-next-line:max-line-length
import { HashLocationStrategy, LocationStrategy } from '@angular/common'; // https://medium.com/wineofbits/angular-2-routing-404-page-not-found-on-refresh-a9a0f5786268

import { MaterialModule } from './material/material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { apiHttpJsonService } from './api.json.http.service';
import { apiHttpSpringBootService } from './api-spring-boot.service';
import { ImageService } from './image.service';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
// tslint:disable-next-line:max-line-length
import {DpDatePickerModule} from 'ng2-date-picker';  // https://www.npmjs.com/package/ng2-date-picker  // https://github.com/golfadas/ng2-date-picker  // https://medium.com/letsboot/lets-pick-a-date-with-ng2-datepicker-1ba2d9593a66
import { ChartsModule } from 'ng2-charts';


import { AppComponent } from './app.component';

import { AccueilComponent } from './accueil/accueil.component';
import { VisitorShowProjectComponent } from './visitor-show-project/visitor-show-project.component';
import { VisitorContactComponent } from './visitor-contact/visitor-contact.component';
import { VisitorFormContactComponent } from './visitor-form-contact/visitor-form-contact.component';


import { IdentificationComponent } from './identification/identification.component';
import { ProfilUserComponent } from './profil-user/profil-user.component';

import { ProjectAddCompanyOwnerComponent } from './project-add-company-owner/project-add-company-owner.component';
import { MyProjectListCompanyOwnerComponent } from './my-project-list-company-owner/my-project-list-company-owner.component';
import { ProjectsListCompanyOwnerComponent } from './projects-list-company-owner/projects-list-company-owner.component';
import { ProjectEditCompanyOwnerComponent } from './project-edit-company-owner/project-edit-company-owner.component';
import { ProjectShowCompanyOwnerComponent } from './project-show-company-owner/project-show-company-owner.component';
import { MyProjectShowCompanyOwnerComponent } from './my-project-show-company-owner/my-project-show-company-owner.component';
import { MyFavorisProjectsCompanyOwnerComponent } from './my-favoris-projects-company-owner/my-favoris-projects-company-owner.component';
import { MyContribProjectsComponent } from './my-contrib-projects/my-contrib-projects.component';
// tslint:disable-next-line:max-line-length
import { ListProjectsByFiltreByTagUserComponent } from './list-projects-by-filtre-by-tag-user/list-projects-by-filtre-by-tag-user.component';
import { ListMessagerieUserComponent } from './list-messagerie-user/list-messagerie-user.component';


import { IdentificationAdminComponent } from './identification-admin/identification-admin.component';
import { CaptchaIdentificationUserComponent } from './captcha-identification-user/captcha-identification-user.component';
import { ProjectsListAdminComponent } from './projects-list-admin/projects-list-admin.component';
import { ProjectShowAdminComponent } from './project-show-admin/project-show-admin.component';
import { ListUsersAdminComponent } from './list-users-admin/list-users-admin.component';
import {ShowProfilUserAdminComponent} from './show-profil-user-admin/show-profil-user-admin.component';
// tslint:disable-next-line:max-line-length
import { ListProjectsByFiltreByTagAdminComponent } from './list-projects-by-filtre-by-tag-admin/list-projects-by-filtre-by-tag-admin.component';

import { FooterAccueilComponent } from './templates/accueil/footer/footer.component';
import { NavBarAccueilComponent } from './templates/accueil/nav-bar/nav-bar.component';



import { NavTemplatesUserComponent } from './templates/user/nav-templates/nav-templates.component';
import { SideBarLeftTemplatesUserComponent } from './templates/user/side-bar-left-templates/side-bar-left-templates.component';
import { FooterTemplatesUserComponent } from './templates/user/footer-templates/footer-templates.component';


import { NavTemplatesAdministratorComponent } from './templates/administrator/nav-templates/nav-templates.component';
import { SideBarLeftTemplatesAdministratorComponent } from './templates/administrator/side-bar-left-templates/side-bar-left-templates.component';
import { FooterTemplatesAdministratorComponent } from './templates/administrator/footer-templates/footer-templates.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxPayPalModule } from 'ngx-paypal';

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';  // https://github.com/froala/angular-froala-wysiwyg




import { MatDateFormats, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';


import { ListMessagesContactVisitorAdminComponent } from './list-messages-contact-visitor-admin/list-messages-contact-visitor-admin.component';
import { ShowMessageContactVisitorAdminComponent } from './show-message-contact-visitor-admin/show-message-contact-visitor-admin.component';

import { ListMessagerieAdminComponent } from './list-messagerie-admin/list-messagerie-admin.component';
import { ShowMessagerieAdminComponent } from './show-messagerie-admin/show-messagerie-admin.component';
import { ShowMessagerieUserComponent } from './show-messagerie-user/show-messagerie-user.component';
import { ShowMessagerieVisitorAdminComponent } from './show-messagerie-visitor-admin/show-messagerie-visitor-admin.component';
import { SettingProfilUserComponent } from './setting-profil-user/setting-profil-user.component';
import { ConnectionComponent } from './connection/connection.component';
import { LendMeEnBrefComponent } from './lend-me-en-bref/lend-me-en-bref.component';
import { FaqComponent } from './faq/faq.component';

















export const MY_FORMAT: MatDateFormats = {
                                        parse: {
                                                dateInput: 'DD/MM/YYYY',
                                               },
                                        display: {
                                                dateInput: 'DD/MM/YYYY',
                                                monthYearLabel: 'MMM YYYY',
                                                dateA11yLabel: 'DD/MM/YYYY',
                                                monthYearA11yLabel: 'MMMM YYYY',
                                         },
                                  };

export function getBaseUrl() {
                                    return document.getElementsByTagName('base')[0].href;
 }

@NgModule({
  declarations: [
    AppComponent,
    IdentificationComponent,
    AccueilComponent,
    ProfilUserComponent,
    NavTemplatesUserComponent,
    SideBarLeftTemplatesUserComponent,
    FooterTemplatesUserComponent,
    NavTemplatesAdministratorComponent,
    SideBarLeftTemplatesAdministratorComponent,
    FooterTemplatesAdministratorComponent,
    ProjectsListAdminComponent,
    ProjectShowAdminComponent,
    ProjectAddCompanyOwnerComponent,
    ProjectsListCompanyOwnerComponent,
    ProjectEditCompanyOwnerComponent,
    ProjectShowCompanyOwnerComponent,
    IdentificationAdminComponent,
    MyProjectListCompanyOwnerComponent,
    MyProjectShowCompanyOwnerComponent,
    VisitorShowProjectComponent,
    VisitorContactComponent,
    VisitorFormContactComponent,
    FooterAccueilComponent,
    NavBarAccueilComponent,
    MyFavorisProjectsCompanyOwnerComponent,
    MyContribProjectsComponent,
    ListUsersAdminComponent,
    ListMessagesContactVisitorAdminComponent,
    ShowMessageContactVisitorAdminComponent,
    ListMessagerieUserComponent,
    ListMessagerieAdminComponent,
    ShowMessagerieAdminComponent,
    ShowMessagerieUserComponent,
    CaptchaIdentificationUserComponent,
    ShowProfilUserAdminComponent,
    ShowMessagerieVisitorAdminComponent,
    SettingProfilUserComponent,
    ListProjectsByFiltreByTagUserComponent,
    ListProjectsByFiltreByTagAdminComponent,
    ConnectionComponent,
    LendMeEnBrefComponent,
    FaqComponent,
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    RouterModule,
    MaterialModule,
    NoopAnimationsModule,
    BrowserAnimationsModule,
    NgxUiLoaderModule,
    NgbModule,
    NgxPayPalModule,
    DpDatePickerModule,
    ReactiveFormsModule,
    ChartsModule,
    [FroalaEditorModule.forRoot(), FroalaViewModule.forRoot()],

  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [CookieService, apiHttpJsonService, apiHttpSpringBootService, ImageService, DatePipe,
             { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
             { provide: MAT_DATE_FORMATS, useValue: MY_FORMAT },
             { provide: 'BASE_URL', useFactory: getBaseUrl },
             // tslint:disable-next-line:max-line-length
             {provide: LocationStrategy, useClass: HashLocationStrategy},
             Title
             ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

