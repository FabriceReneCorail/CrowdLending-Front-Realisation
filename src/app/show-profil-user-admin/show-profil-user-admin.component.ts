import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Router } from '@angular/router';
import { apiHttpSpringBootService } from './../api-spring-boot.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import {UserModel, ProjectModel, templteProjectModel, StatutProjectModel, CategorieProjectModel, PorteProjectModel} from '../interfaces/models';

@Component({
  selector: 'app-show-profil-user-admin',
  templateUrl: './show-profil-user-admin.component.html',
  styleUrls: ['./show-profil-user-admin.component.css']
})
export class ShowProfilUserAdminComponent implements OnInit {

  public infosUser: UserModel = new UserModel();

  public infosCompanyOwner: UserModel = new UserModel();

  public listCreatedProjects: Array<ProjectModel> = [];

  public listCtribProjects: Array<ProjectModel> = [];

  public listtemplateCreatedProjects: Array<templteProjectModel> = [];

  public listtemplateCtribProjects: Array<templteProjectModel> = [];




  public listDiffrenceJours = [];

  public pollingListProject: any;

  public paramObjectUpdate = { action_update: false };

  public listPorteProject: Array<PorteProjectModel> = [];

  public listCategorieProject: Array<CategorieProjectModel> = [];

  public listeStatusProject: Array<StatutProjectModel> = [];

  public listProjectsTemp: Array<ProjectModel> = [];

  public tagSearch = '';

  constructor(private router: Router, private route: ActivatedRoute, private cookie: CookieService,
              private apiService: apiHttpSpringBootService, private ngxService: NgxUiLoaderService, private datePipe: DatePipe) {

                if (this.cookie.get('infosUser')) {

                  this.infosUser = JSON.parse(this.cookie.get('infosUser'));

                  this.apiService.checkAdminByToken(this.infosUser).subscribe((data: any) => {

                      if (data) {

                        if (this.infosUser.photoUser === '' || !this.infosUser.photoUser) {

                          if (this.infosUser.sex === 'F') {

                            this.infosUser.photoUser = './assets/img/users/user_f.png';

                          }

                          if (this.infosUser.sex === 'H') {

                            this.infosUser.photoUser = './assets/img/users/user_m.png';

                          }

                        }

                        this.route.params.subscribe(params => {

                          this.getInfosUser(params.token);

                          this.getListAllProjects(params.token);

                        });

                        console.log('ProfilUserComponent', this.infosUser);

                      } else {

                        this.router.navigate(['/admin-login']);
                      }


                    }, (error: any) => {

                      this.router.navigate(['/admin-login']);
                    });



                } else {


                      this.router.navigate(['/admin-login']);
                }

   }

  ngOnInit(): void {  }

  getInfosUser(tokenUser){


       this.apiService.getInfosUserByAdminToken(this.infosUser, tokenUser).subscribe((dataUser: UserModel) => {

                 console.log('dataUser', dataUser);

                 this.infosCompanyOwner = dataUser;

                 if (this.infosCompanyOwner.photoUser === '' || !this.infosCompanyOwner.photoUser) {

                  if (this.infosCompanyOwner.sex === 'F') {

                    this.infosCompanyOwner.photoUser = './assets/img/users/user_f.png';

                  }

                  if (this.infosUser.sex === 'H') {

                    this.infosCompanyOwner.photoUser = './assets/img/users/user_m.png';

                  }

                }

        }, (error: any) => { });


  }

  getListAllProjects(tokenUser) {

    this.ngxService.start();

    this.apiService.listMyProjectByUserByAdmin(this.infosUser, tokenUser).subscribe((dataMyProjects: Array<ProjectModel>) => {

      // console.log(data);

      if (dataMyProjects) {

        this.listCreatedProjects = dataMyProjects;

        // tslint:disable-next-line:prefer-for-of
        for (let index = 0; index < this.listCreatedProjects.length; index++) {


          const objectTemplteCreatedProject: templteProjectModel = new templteProjectModel();

          objectTemplteCreatedProject.project = this.listCreatedProjects[index];

          objectTemplteCreatedProject.nbrJours = this.calculNombredeJours(this.listCreatedProjects[index]);

          this.listtemplateCreatedProjects.push(objectTemplteCreatedProject);
        }

        this.formaterListProject();

      } else {

        // alert("pas de projects-1");
      }


    }, (error: any) => {


    });

    /************************************************************************************** */

    this.apiService.listContribProjectByUserByAdmin(this.infosUser, tokenUser).subscribe((dataContribProject: Array<ProjectModel>) => {

      // console.log(data);

      if (dataContribProject) {

        this.listCtribProjects = dataContribProject;

        // tslint:disable-next-line:prefer-for-of
        for (let index = 0; index < this.listCtribProjects.length; index++) {


          const objectTemplteContribProject: templteProjectModel = new templteProjectModel();

          objectTemplteContribProject.project = this.listCtribProjects[index];

          objectTemplteContribProject.nbrJours = this.calculNombredeJours(this.listCtribProjects[index]);

          this.listtemplateCtribProjects.push(objectTemplteContribProject);
        }

        this.formaterListProject();

      } else {

        // alert("pas de projects-1");
      }



      this.ngxService.stop();


    }, (error: any) => {

      this.ngxService.stop();
    });


    /************************************************************************************** */

  }

  calculNombredeJours(dataProject: ProjectModel) {

    const date1 = new Date();

    const date2 = new Date(dataProject.date_limite_collecte);

    const diff = this.dateDiff(date1, date2);

    if (diff.day < 0) {

      this.updateExpireDateLimiteFonsCollecte(dataProject);
    }

    return 'J-' + diff.day;

    // this.listProjects[indexProject].nbrJoursRestant = 'J-' + diff.day;

    // tslint:disable-next-line:max-line-length
    //  console.log('Entre le ' + date1.toString() + ' et ' + date2.toString() + ' il y a ' + diff.day + ' jours, ' + diff.hour + ' heures, ' + diff.min + ' minutes et ' + diff.sec + ' secondes');

  }

  dateDiff(date1, date2) {

    const diff = { day: 0, hour: 0, min: 0, sec: 0 };                           // Initialisation du retour

    let tmp = date2 - date1;

    tmp = Math.floor(tmp / 1000);             // Nombre de secondes entre les 2 dates
    diff.sec = tmp % 60;                    // Extraction du nombre de secondes

    tmp = Math.floor((tmp - diff.sec) / 60);    // Nombre de minutes (partie entière)
    diff.min = tmp % 60;                    // Extraction du nombre de minutes

    tmp = Math.floor((tmp - diff.min) / 60);    // Nombre d'heures (entières)
    diff.hour = tmp % 24;                   // Extraction du nombre d'heures

    tmp = Math.floor((tmp - diff.hour) / 24);   // Nombre de jours restants
    diff.day = tmp;

    console.log('diff', diff);

    return diff;
  }

  updateExpireDateLimiteFonsCollecte(dataProject: ProjectModel) {



    //  console.log("indexProject = " + indexProject + " & " + this.listProjects[indexProject]._statut_project.nom);

    if (dataProject._statut_project.nom === 'Valide' || dataProject._statut_project.nom === 'Renouvele') {



      dataProject._statut_project.id = 5;

      dataProject._statut_project.nom = 'Termine';

      this.apiService.updateDataProjectByUser(dataProject).subscribe((data: ProjectModel) => {

        console.log('methode-updateExpireDateLimiteFonsCollecte', data);

      }, (error: any) => {

        this.ngxService.stop();
      });
    }



  }

  formaterListProject() {


     /******************************************************************* */

    // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < this.listCreatedProjects.length; index++) {


      if (this.listCreatedProjects[index]._statut_project.nom === 'Attente') {


        this.listCreatedProjects[index]._statut_project.nom = 'Attente';

      }

      if (this.listCreatedProjects[index]._statut_project.nom === 'Valide') {


        this.listCreatedProjects[index]._statut_project.nom = 'Validé';

      }

      if (this.listCreatedProjects[index]._statut_project.nom === 'Termine') {


        this.listCreatedProjects[index]._statut_project.nom = 'Terminé';

      }

      if (this.listCreatedProjects[index]._statut_project.nom === 'Annule') {


        this.listCreatedProjects[index]._statut_project.nom = 'Annulé';

      }

      if (this.listCreatedProjects[index]._statut_project.nom === 'En cours') {


        this.listCreatedProjects[index]._statut_project.nom = 'En cours';

      }

      if (this.listCreatedProjects[index]._statut_project.nom === 'Renouvele') {


        this.listCreatedProjects[index]._statut_project.nom = 'Renouvele';

      }

      // tslint:disable-next-line:max-line-length
      this.listtemplateCreatedProjects[index].dateLimiteCollecteFormate = this.datePipe.transform(this.listCreatedProjects[index].date_limite_collecte, 'dd-MM-yyyy');

    }
      /********************************************************** */

       // tslint:disable-next-line:prefer-for-of
    for (let indexBis = 0; indexBis < this.listCtribProjects.length; indexBis++) {


      if (this.listCtribProjects[indexBis]._statut_project.nom === 'Attente') {


        this.listCtribProjects[indexBis]._statut_project.nom = 'Attente';

      }

      if (this.listCtribProjects[indexBis]._statut_project.nom === 'Valide') {


        this.listCtribProjects[indexBis]._statut_project.nom = 'Validé';

      }

      if (this.listCtribProjects[indexBis]._statut_project.nom === 'Termine') {


        this.listCtribProjects[indexBis]._statut_project.nom = 'Terminé';

      }

      if (this.listCtribProjects[indexBis]._statut_project.nom === 'Annule') {


        this.listCtribProjects[indexBis]._statut_project.nom = 'Annulé';

      }

      if (this.listCtribProjects[indexBis]._statut_project.nom === 'En cours') {


        this.listCtribProjects[indexBis]._statut_project.nom = 'En cours';

      }

      if (this.listCtribProjects[indexBis]._statut_project.nom === 'Renouvele') {


        this.listCtribProjects[indexBis]._statut_project.nom = 'Renouvele';

      }

      // tslint:disable-next-line:max-line-length
      this.listtemplateCtribProjects[indexBis].dateLimiteCollecteFormate = this.datePipe.transform(this.listCtribProjects[indexBis].date_limite_collecte, 'dd-MM-yyyy');


    }


  }

}
