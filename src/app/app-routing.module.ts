import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IdentificationComponent } from './identification/identification.component';
import { ProfilUserComponent } from './profil-user/profil-user.component';

import { AccueilComponent } from './accueil/accueil.component';
import { VisitorShowProjectComponent } from './visitor-show-project/visitor-show-project.component';
import { VisitorContactComponent } from './visitor-contact/visitor-contact.component';
import { VisitorFormContactComponent } from './visitor-form-contact/visitor-form-contact.component';

import { ProjectAddCompanyOwnerComponent } from './project-add-company-owner/project-add-company-owner.component';
import { ProjectsListCompanyOwnerComponent } from './projects-list-company-owner/projects-list-company-owner.component';
import { MyProjectListCompanyOwnerComponent } from './my-project-list-company-owner/my-project-list-company-owner.component';
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
import { ConnectionComponent } from './connection/connection.component';
import { FaqComponent } from './faq/faq.component';
import { LendMeEnBrefComponent } from './lend-me-en-bref/lend-me-en-bref.component';




const routes: Routes = [
  { path: '', component: AccueilComponent},
  { path: 'page-contact', component: VisitorContactComponent},
  { path: 'form-contact', component: VisitorFormContactComponent},
  { path: 'visitor-projetcs-show/:token', component: VisitorShowProjectComponent},
  { path: 'Identification', component: IdentificationComponent},
  { path: 'captcha-identification', component: CaptchaIdentificationUserComponent},
  { path: 'Identification/:deconnection', component: IdentificationComponent},
  { path: 'profilUser', component: ProfilUserComponent},
  { path: 'admin-login', component: IdentificationAdminComponent},
  { path: 'admin-projetcs', component: ProjectsListAdminComponent},
  { path: 'admin-search-projetcs-by-tag', component: ListProjectsByFiltreByTagAdminComponent},
  { path: 'admin-users', component: ListUsersAdminComponent},
  { path: 'admin-profil-user/:token', component: ShowProfilUserAdminComponent},
  { path: 'admin-projetcs-show/:token', component: ProjectShowAdminComponent},
  { path: 'user-all-projetcs', component: ProjectsListCompanyOwnerComponent},
  { path: 'user-my-projetcs', component: MyProjectListCompanyOwnerComponent},
  { path: 'user-my-contrib-projetcs', component: MyContribProjectsComponent},
  { path: 'user-favoris-projetcs', component: MyFavorisProjectsCompanyOwnerComponent},
  { path: 'user-projetcs-add', component: ProjectAddCompanyOwnerComponent},
  { path: 'user-my-projetcs-show/:token', component: MyProjectShowCompanyOwnerComponent},
  { path: 'user-my-projetcs-edit/:token', component: ProjectEditCompanyOwnerComponent},
  { path: 'user-projetcs-show/:token', component: ProjectShowCompanyOwnerComponent},
  { path: 'user-search-projetcs-by-tag', component: ListProjectsByFiltreByTagUserComponent},
  { path: 'user-messagerie', component: ListMessagerieUserComponent},
  {path: 'connection', component: ConnectionComponent},
  {path:'faq', component: FaqComponent},
  {path: 'lmbref',component: LendMeEnBrefComponent}
];

@NgModule({
  imports: [
    CommonModule,
   // RouterModule.forRoot(routes, {useHash: true})
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class RoutingModule { }
