import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { apiHttpSpringBootService } from './../api-spring-boot.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import {UserModel, ProjectModel, templteProjectModel, FavorisProjectUserModel,
         StatutProjectModel, PorteProjectModel, CategorieProjectModel, HeartProjectUserModel} from '../interfaces/models';



@Component({
  selector: 'app-projects-list-company-owner',
  templateUrl: './projects-list-company-owner.component.html',
  styleUrls: ['./projects-list-company-owner.component.css']
})
export class ProjectsListCompanyOwnerComponent implements OnInit {


  public infosUser: UserModel = new UserModel();

  public listProjects: Array<ProjectModel> = [];

  public listProjectsTemp: Array<ProjectModel> = [];

  public listtemplateProjects: Array<templteProjectModel> = [];

  public listDiffrenceJours = [];

  public objectFavorisProject: FavorisProjectUserModel = new FavorisProjectUserModel();

  public objectHeartProject: HeartProjectUserModel = new HeartProjectUserModel();

  public listPorteProject: Array<PorteProjectModel> = [];

  public listCategorieProject: Array<CategorieProjectModel> = [];

  public listeStatusProject: Array<StatutProjectModel> = [];

  public tagSearch = '';

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

      this.getListPorteProject();

      this.getListCategorieProject();

      this.getListStatutProject();

      console.log('ProfilUserComponent', this.infosUser);


    } else {
      this.router.navigate(['/Identification']);

    }



  }

  ngOnInit(): void { }


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

  getListAllProjects(objectUser) {

    this.ngxService.start();

    this.apiService.listAllProjectByUser(objectUser).subscribe((data: any) => {

      // console.log(data);

      if (data) {

        this.listProjects = data;

        const paramAction = {update : false};

        for (let index = 0; index < this.listProjects.length; index++) {


          const objectTemplteProjectModel: templteProjectModel = new templteProjectModel();

          objectTemplteProjectModel.project = this.listProjects[index];

          objectTemplteProjectModel.nbrJours = this.calculNombredeJours(index);

          objectTemplteProjectModel.heartUser = './assets/img/heart-icon-bis.png';

          this.checkFavorisProject(index);

          this.checkHeartsProject(index, paramAction);

          this.listtemplateProjects.push(objectTemplteProjectModel);


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

checkHeartsProject(indexProject, paramAction){


    this.apiService.checkHeartProjectByUser(this.listProjects[indexProject], this.infosUser).subscribe((dataHeart: any) => {

         if (dataHeart){

          this.listtemplateProjects[indexProject].heartUser = './assets/img/heart-icon.png';

          if (paramAction.update === true){

            this.deleteHeartProjectForBdd(indexProject);

          }

         }



    }, (error: any) => {

         if (paramAction.update === true){

               this.addHeartProjectForBdd(indexProject);
         }
     });


}

addHeartProject(indexProject, project){

  const paramAction = {update : true};

  this.checkHeartsProject(indexProject, paramAction);

}

addHeartProjectForBdd(indexProject): void{

  console.log('indexProject = ', indexProject);

  this.ngxService.start();

  const date = new Date();

  console.log('this.listProjects[indexProject] = ', this.listProjects[indexProject]);

  this.objectHeartProject._project = this.listProjects[indexProject];

  this.objectHeartProject._user = this.infosUser;

  this.objectHeartProject.date_created = date.toLocaleString('fr-FR', {
                                                             weekday: 'long',
                                                             year: 'numeric',
                                                             month: 'long',
                                                             day: 'numeric',
                                                             hour: 'numeric',
                                                             minute: 'numeric',
                                                             second: 'numeric',
   });

  this.objectHeartProject.timestamp = Date.now();


  this.apiService.addHeartProjectByUser(this.objectHeartProject).subscribe((data: any) => {


    this.listtemplateProjects[indexProject].heartUser = './assets/img/heart-icon.png';

    this.updateDataProject(indexProject);

    this.ngxService.stop();

  }, (error: any) => {

    this.ngxService.stop();
  });


}

deleteHeartProjectForBdd(indexProject){

  this.ngxService.start();

  this.objectHeartProject._project = this.listProjects[indexProject];

  this.objectHeartProject._user = this.infosUser;

  this.apiService.deleteHeartProjectByUser(this.objectHeartProject).subscribe((data: any) => {


    this.listtemplateProjects[indexProject].heartUser = './assets/img/heart-icon-bis.png';

    this.updateDataProject(indexProject);

    this.ngxService.stop();

}, (error: any) => {

  this.ngxService.stop();
});


}

addProjectByMyFavoris(indexProject, project){

   this.checkFavorisProjectForBdd(indexProject, project);


}



checkFavorisProject(indexProject){

    this.ngxService.start();

    this.apiService.checkFavorisProjectByUser(this.listProjects[indexProject], this.infosUser).subscribe((data: any) => {


      this.listtemplateProjects[indexProject].favorisProject = 1;

      this.ngxService.stop();

    }, (error: any) => {

      this.listtemplateProjects[indexProject].favorisProject = 0;

      this.ngxService.stop();
    });

  }

  checkFavorisProjectForBdd(indexProject, project){

    this.ngxService.start();

    this.apiService.checkFavorisProjectByUser(this.listProjects[indexProject], this.infosUser).subscribe((data: any) => {

      this.listtemplateProjects[indexProject].favorisProject = 1;

      this.ngxService.stop();

    }, (error: any) => {

      this.addProjectByMyFavorisForBdd(indexProject, project);

      this.ngxService.stop();
    });

  }

  removeProjectByMyFavoris(indexProject, project){

    this.ngxService.start();

    this.objectFavorisProject._project = project;

    this.objectFavorisProject._user = this.infosUser;

    this.apiService.deleteFavorisProjectByUser(this.objectFavorisProject).subscribe((data: any) => {


      this.listtemplateProjects[indexProject].favorisProject = 0;

      this.ngxService.stop();

  }, (error: any) => {

    this.ngxService.stop();
  });



  }

  addProjectByMyFavorisForBdd(indexProject, project){

    this.ngxService.start();

    const date = new Date();

    this.objectFavorisProject._project = project;

    this.objectFavorisProject._user = this.infosUser;

    this.objectFavorisProject.date_created = date.toLocaleString('fr-FR', {
                                                             weekday: 'long',
                                                             year: 'numeric',
                                                             month: 'long',
                                                             day: 'numeric',
                                                             hour: 'numeric',
                                                             minute: 'numeric',
                                                             second: 'numeric',
   });

    this.objectFavorisProject.timestamp = Date.now();

    this.apiService.addProjectByMyFavoris(this.objectFavorisProject).subscribe((data: any) => {


       this.listtemplateProjects[indexProject].favorisProject = 1;

       this.ngxService.stop();

   }, (error: any) => {

     this.ngxService.stop();
   });


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

    if (this.listProjects[indexProject]._statut_project.nom === 'Valide' || this.listProjects[indexProject]._statut_project.nom === 'Renouvele') {



      this.listProjects[indexProject]._statut_project.id = 5;

      this.listProjects[indexProject]._statut_project.nom = 'Termine';

      this.apiService.updateDataProjectByUser(this.listProjects[indexProject]).subscribe((dataProject: ProjectModel) => {

        console.log('methode-updateExpireDateLimiteFonsCollecte', dataProject);

      }, (error: any) => {

      });
    }


  }

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

  updateDataProject(indexProject){


    this.apiService.getDataProject(this.listProjects[indexProject].token).subscribe((dataPorject: ProjectModel) => {

      this.listProjects[indexProject] = dataPorject;


    }, (error: any) => {


     });

 }


}
