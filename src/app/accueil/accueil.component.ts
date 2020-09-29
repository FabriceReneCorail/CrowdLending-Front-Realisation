import { Component, OnInit} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {Router} from '@angular/router';
import { apiHttpSpringBootService } from './../api-spring-boot.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import {ProjectModel, templteProjectModel} from '../interfaces/models';
import { CookieService } from 'ngx-cookie-service';
import { UserModel } from '../interfaces/models';

declare var navigator: any;

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css'],
})
export class AccueilComponent implements OnInit {
  public listProjects: Array<ProjectModel> = [];

  public listtemplateProjects: Array<templteProjectModel> = [];

  public listDiffrenceJours = [];

  public pollingListProject: any;

  public paramObjectUpdate = { action_update: false };

  public userLang: any;

  public infoUser: UserModel = new UserModel();


  constructor(
    private router: Router,
    private apiService: apiHttpSpringBootService,
    private titleService: Title,
    // tslint:disable-next-line:align
    private ngxService: NgxUiLoaderService,
    private datePipe: DatePipe,
    private cookie: CookieService
  ) {
    this.titleService.setTitle('accueil');

    this.getListProjects(this.paramObjectUpdate);
  }

  ngOnInit(): void {
    this.userLang = navigator.language || navigator.userLanguage;
    // alert('this.userLang = ' + this.userLang );
  }



  getListProjectsBis() {
    this.apiService.listAllProjectsForVisitor().subscribe(
      (data: any) => {},
      (error: any) => {}
    );
  }

  getListProjects(paramObjectUpdate) {
    if (!paramObjectUpdate.action_update) {
      this.ngxService.start();
    }

    this.apiService.listAllProjectsForVisitor().subscribe(
      (data: any) => {
        // console.log(data);

        if (data) {
          this.listProjects = data;

          // tslint:disable-next-line:prefer-for-of
          for (let index = 0; index < this.listProjects.length; index++) {
            const objectTemplteProjectModel: templteProjectModel = new templteProjectModel();

            objectTemplteProjectModel.project = this.listProjects[index];

            objectTemplteProjectModel.nbrJours = this.calculNombredeJours(
              index
            );

            this.listtemplateProjects.push(objectTemplteProjectModel);
          }

          this.formaterListProject();

          /*  this.pollingListProject = setInterval(() => {

             this.paramObjectUpdate.action_update = true;

             this.getListProjects(this.paramObjectUpdate);

         }, 300 * 1000); */ // 5*60*1000 = 5 minute
        } else {
          // alert("pas de projects-1");
        }

        if (!paramObjectUpdate.action_update) {
          this.ngxService.stop();
        }
      },
      (error: any) => {
        if (!paramObjectUpdate.action_update) {
          this.ngxService.stop();
        }
      }
    );
  }

  calculNombredeJours(indexProject) {
    const date1 = new Date();

    const date2 = new Date(
      this.listProjects[indexProject].date_limite_collecte
    );

    const diff = this.dateDiff(date1, date2);

    return 'J-' + diff.day;

    // this.listProjects[indexProject].nbrJoursRestant = 'J-' + diff.day;

    // tslint:disable-next-line:max-line-length
    //  console.log('Entre le ' + date1.toString() + ' et ' + date2.toString() + ' il y a ' + diff.day + ' jours, ' + diff.hour + ' heures, ' + diff.min + ' minutes et ' + diff.sec + ' secondes');
  }

  dateDiff(date1, date2) {
    const diff = { day: 0, hour: 0, min: 0, sec: 0 }; // Initialisation du retour
    let tmp = date2 - date1;

    tmp = Math.floor(tmp / 1000); // Nombre de secondes entre les 2 dates
    diff.sec = tmp % 60; // Extraction du nombre de secondes

    tmp = Math.floor((tmp - diff.sec) / 60); // Nombre de minutes (partie entière)
    diff.min = tmp % 60; // Extraction du nombre de minutes

    tmp = Math.floor((tmp - diff.min) / 60); // Nombre d'heures (entières)
    diff.hour = tmp % 24; // Extraction du nombre d'heures

    tmp = Math.floor((tmp - diff.hour) / 24); // Nombre de jours restants
    diff.day = tmp;

    console.log('diff', diff);

    return diff;
  }

  formaterListProject() {
    // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < this.listProjects.length; index++) {
      /******************************************************************* */

      if (this.listProjects[index]._statut_project.nom === 'Attente') {
        this.listProjects[index]._statut_project.nom = 'Attente';
      }

      if (this.listProjects[index]._statut_project.nom === 'Valide') {
        this.listProjects[index]._statut_project.nom = 'Validé';
      }

      if (this.listProjects[index]._statut_project.nom === 'Termine') {
        this.listProjects[index]._statut_project.nom = 'Terminé';
      }

      if (this.listProjects[index]._statut_project.nom === 'Annule') {
        this.listProjects[index]._statut_project.nom = 'Annulé';
      }

      if (this.listProjects[index]._statut_project.nom === 'En cours') {
        this.listProjects[index]._statut_project.nom = 'En cours';
      }

      if (this.listProjects[index]._statut_project.nom === 'Renouvele') {
        this.listProjects[index]._statut_project.nom = 'Renouvele';
      }

      /********************************************************** */

      this.listtemplateProjects[
        index
      ].dateLimiteCollecteFormate = this.datePipe.transform(
        this.listProjects[index].date_limite_collecte,
        'dd-MM-yyyy'
      );

      /********************************************************** */
    }
  }
  getCookieInfos(){
    if (this.cookie.get('infosUser')) {
      console.log(JSON.parse(this.cookie.get('infosUser')));
     return this.infoUser = JSON.parse(this.cookie.get('infosUser'));
  }else{
    this.infoUser;
  }
 }
}
