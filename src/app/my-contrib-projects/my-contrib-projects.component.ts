import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { apiHttpSpringBootService } from './../api-spring-boot.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import {UserModel, ProjectModel, templteProjectModel, InvestiteurProjectModel} from '../interfaces/models';

@Component({
  selector: 'app-my-contrib-projects',
  templateUrl: './my-contrib-projects.component.html',
  styleUrls: ['./my-contrib-projects.component.css']
})
export class MyContribProjectsComponent implements OnInit {

  public infosUser: UserModel = new UserModel();

  public listProjects: Array<ProjectModel> = [];

  public listProjectsContrib: Array<InvestiteurProjectModel> = [];

  public listtemplateProjects: Array<templteProjectModel> = [];

  public listDiffrenceJours = [];

  constructor(private router: Router, private cookie: CookieService, private apiService: apiHttpSpringBootService
    // tslint:disable-next-line:align
    , private ngxService: NgxUiLoaderService, private datePipe: DatePipe) {

    if (this.cookie.get('infosUser')) {

      this.infosUser = JSON.parse(this.cookie.get('infosUser'));

      if (this.infosUser.photoUser === '' || !this.infosUser.photoUser) {

        if (this.infosUser.sex === 'F') {

          this.infosUser.photoUser = './assets/img/users/user_f.png';


        }

        if (this.infosUser.sex === 'H') {

          this.infosUser.photoUser = './assets/img/users/user_m.png';


        }

      }

      this.getListAllProjects(this.infosUser);

      console.log('ProfilUserComponent', this.infosUser);


    } else {

      this.router.navigate(['/Identification']);
    }



  }

  ngOnInit(): void { }


  getListAllProjects(objectUser) {

    this.ngxService.start();

    this.apiService.listMyContribProjectByUser(objectUser).subscribe((data: Array<InvestiteurProjectModel>) => {

      // console.log(data);

      if (data) {

        this.listProjectsContrib = data;

        for (let index = 0; index < this.listProjectsContrib.length; index++) {


          const objectTemplteProjectModel: templteProjectModel = new templteProjectModel();

          objectTemplteProjectModel.project = this.listProjectsContrib[index]._project;

          this.listProjects.push(this.listProjectsContrib[index]._project);

          this.listtemplateProjects.push(objectTemplteProjectModel);

          objectTemplteProjectModel.nbrJours = this.calculNombredeJours(index);



        }

        this.formaterListProject();

      } else {

        // alert("pas de projects-1");
      }



      this.ngxService.stop();


    }, (error: any) => {

      this.ngxService.stop();
    });

  }

  updateExpireDateLimiteFonsCollecte(indexProject) {



    //  console.log("indexProject = " + indexProject + " & " + this.listProjects[indexProject]._statut_project.nom);

    if (this.listProjects[indexProject]._statut_project.nom === 'Valide' || this.listProjects[indexProject]._statut_project.nom === 'Renouvele') {



      this.listProjects[indexProject]._statut_project.id = 5;

      this.listProjects[indexProject]._statut_project.nom = 'Termine';

      this.apiService.updateDataProjectByUser(this.listProjects[indexProject]).subscribe((dataProject: ProjectModel) => {

        console.log('methode-updateExpireDateLimiteFonsCollecte', dataProject);

      }, (error: any) => {

        this.ngxService.stop();
      });
    }



  }

  calculNombredeJours(indexProject) {

    const date1 = new Date();

    const date2 = new Date(this.listProjects[indexProject].date_limite_collecte);

    const diff = this.dateDiff(date1, date2);

    if (diff.day < 0) {

      this.updateExpireDateLimiteFonsCollecte(indexProject);
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

      this.listtemplateProjects[index].dateLimiteCollecteFormate = this.datePipe.transform(this.listProjects[index].date_limite_collecte, 'dd-MM-yyyy');


      /********************************************************** */


    }


  }



  removeImageByIdImage(idImage) {


    /* this.apiService.deleteImagesByProject(idImage).subscribe((data: any) => {

         // console.log(data);

       }, (error: any) => {

      }); */


  }

  removeProject(indexProject) {

    /*  if (confirm('Vous ete sure de supprimer le projet ')) {
           /*********************** Supression les images associe au project ******************************** */

    // this.getAllImagesByIdProject(this.listProjects[indexProject].id);

    /**********************  Supression fiche project ****************************** */

    /* this.apiService.deleteProject(this.listProjects[indexProject].id).subscribe((data: any) => {

       // console.log(data);

       this.listProjects.splice(indexProject, 1);

       }, (error: any) => {

      });
     } */

  }

  getAllImagesByIdProject(idProject) {


    this.apiService.getAllImagesByIdProject(idProject).subscribe((data: any) => {

      // console.log(data);

      // tslint:disable-next-line:prefer-for-of
      for (let index = 0; index < data.length; index++) {

        this.removeImageByIdImage(data[index].id);


      }

    }, (error: any) => {

    });



  }

}
