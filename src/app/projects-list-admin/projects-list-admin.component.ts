import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { apiHttpSpringBootService } from './../api-spring-boot.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import {UserModel, ProjectModel, templteProjectModel, StatutProjectModel, CategorieProjectModel, PorteProjectModel} from '../interfaces/models';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-projects-list-admin',
  templateUrl: './projects-list-admin.component.html',
  styleUrls: ['./projects-list-admin.component.css']
})
export class ProjectsListAdminComponent implements OnInit {

  public infosUser: UserModel = new UserModel();

  public listProjects: Array<ProjectModel> = [];

  public listtemplateProjects: Array<templteProjectModel> = [];

  public listDiffrenceJours = [];

  public pollingListProject: any;

  public paramObjectUpdate = { action_update: false };

  public listPorteProject: Array<PorteProjectModel> = [];

  public listCategorieProject: Array<CategorieProjectModel> = [];

  public listeStatusProject: Array<StatutProjectModel> = [];

  public listProjectsTemp: Array<ProjectModel> = [];

  public tagSearch = '';

  constructor(private router: Router, private cookie: CookieService, private apiService: apiHttpSpringBootService
    ,         private ngxService: NgxUiLoaderService, private datePipe: DatePipe) {

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

            this.getListProjects(this.paramObjectUpdate);

            this.getListPorteProject();

            this.getListCategorieProject();

            this.getListStatutProject();

            console.log('ProfilUserComponent', this.infosUser);

          } else {

            this.router.navigate(['/admin-login']);
          }





        }, (error: any) => {

          this.router.navigate(['/admin-login']);
        });




    } else {


        // this.router.navigate(['/admin-login']);
    }





  }

  ngOnInit(): void { }

  searchProjectsByMotCle(){


    this.listProjects = this.listProjectsTemp ;

    console.log(this.listProjects.length);


    console.log('tagSearch =', this.tagSearch);

    const tagSearch = this.tagSearch;

    // tslint:disable-next-line:only-arrow-functions
    this.listProjects =  this.listProjects.filter(function(project: ProjectModel ) {

       return (project.nom.indexOf(tagSearch) > -1 ||  project.description.indexOf(tagSearch) > -1);

    });

}

  onChangePorteProject(index){

    this.listProjects = this.listProjectsTemp;

    if (index !== ''){

      this.listProjects = this.listProjects.filter((item: ProjectModel) => {

        return item._porte_project.nom === this.listPorteProject[index].nom;

      });
    }

  }

  onChangeCategorieProject(index){

    this.listProjects = this.listProjectsTemp;

    if (index !== ''){

      this.listProjects = this.listProjects.filter((item: ProjectModel) => {

        return item.categoryProject.nom === this.listCategorieProject[index].nom;

     });
    }


  }

  onChangeStatutProject(index){

    this.listProjects = this.listProjectsTemp;

    if (index !== ''){

      let statusProject = '';

      if (this.listeStatusProject[index].nom === 'Attente') {


        statusProject = 'Attente';

      }

      if (this.listeStatusProject[index].nom === 'Valide') {


        statusProject = 'Validé';

      }

      if (this.listeStatusProject[index].nom === 'Termine') {


        statusProject = 'Terminé';

      }

      if (this.listeStatusProject[index].nom === 'Annule') {


        statusProject = 'Annulé';

      }

      if (this.listeStatusProject[index].nom === 'En cours') {


        statusProject = 'En cours';

      }

      if (this.listeStatusProject[index].nom === 'Renouvele') {


        statusProject = 'Renouvele';

      }

      this.listProjects = this.listProjects.filter((item: ProjectModel) => {

        return item._statut_project.nom === statusProject;

     });
    }




  }

  getListStatutProject() {


    this.apiService.getListStatutProject().subscribe((data: Array<StatutProjectModel>) => {


      console.log('data-ListStatutProject', data);

      this.listeStatusProject = data;

    }, (error: any) => {

    });

  }

  getListPorteProject(){

    this.apiService.getListPorteProject().subscribe((data: any) => {

      console.log(data);

      this.listPorteProject = data;


     }, (error: any) => {

    });

  }

  getListCategorieProject(){

    this.apiService.getListCategorieProject().subscribe((data: any) => {

      console.log(data);

      this.listCategorieProject = data;


     }, (error: any) => {

    });

  }

  getListProjects(paramObjectUpdate) {

    if (!paramObjectUpdate.action_update) {

      this.ngxService.start();
    }



    this.apiService.listAllProjectsForAdmin().subscribe((data: any) => {

      // console.log(data);

      if (data) {

        this.listProjects = data;

        // tslint:disable-next-line:prefer-for-of
        for (let index = 0; index < this.listProjects.length; index++) {


          const objectTemplteProjectModel: templteProjectModel = new templteProjectModel();

          objectTemplteProjectModel.project = this.listProjects[index];

          objectTemplteProjectModel.nbrJours = this.calculNombredeJours(index);

          this.listtemplateProjects.push(objectTemplteProjectModel);


        }

        this.formaterListProject();




        /* this.pollingListProject = setInterval(() => {

               this.paramObjectUpdate.action_update = true;

               this.getListProjects(this.paramObjectUpdate);

           }, 300 * 1000); */ // 60*1000 = 1 minute

      } else {

        // alert("pas de projects-1");
      }

      if (!paramObjectUpdate.action_update) {

        this.ngxService.stop();
      }





    }, (error: any) => {

      if (!paramObjectUpdate.action_update) {

        this.ngxService.stop();
      }
    });


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

      this.listProjectsTemp = this.listProjects;


      /********************************************************** */


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

  updateExpireDateLimiteFonsCollecte(indexProject) {


    //  console.log("indexProject = " + indexProject + " & " + this.listProjects[indexProject]._statut_project.nom);

    // tslint:disable-next-line:max-line-length
    if (this.listProjects[indexProject]._statut_project.nom === 'Valide' || this.listProjects[indexProject]._statut_project.nom === 'Renouvele') {



      this.listProjects[indexProject]._statut_project.id = 5;

      this.listProjects[indexProject]._statut_project.nom = 'Termine';

      this.apiService.updateDataProjectByAdmin(this.listProjects[indexProject]).subscribe((dataProject: ProjectModel) => {

        console.log('methode-updateExpireDateLimiteFonsCollecte', dataProject);

      }, (error: any) => {

        this.ngxService.stop();
      });
    }


  }

  removeProject(indexProject) {



  }

}
