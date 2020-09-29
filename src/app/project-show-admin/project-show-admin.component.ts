import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Router } from '@angular/router';
import { apiHttpSpringBootService } from './../api-spring-boot.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import {
  UserModel, ProjectModel, templteProjectModel, ImageProjectModel
  , AdressReseauxSociauxProjectModel, commentProjectModel, StatutProjectModel,
  QuestionRepProjectByAdminForUserModel, QuestionRepProjectByUserForAdminModel,
  // tslint:disable-next-line:max-line-length
  QuestionRepProjectByUserForUserModel, InvestiteurProjectModel, fondInvestor, StatistiquesChartsLikeModel, StatistiquesChartsDislikesModel,
  StatistiquesChartsHeartModel, StatistiquesChartsVueModel, NewsProjectModel, CommissionProjectModel
} from '../interfaces/models';

import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Color, Label, MultiDataSet } from 'ng2-charts';
import { Title } from '@angular/platform-browser';




@Component({
  selector: 'app-project-show-admin',
  templateUrl: './project-show-admin.component.html',
  styleUrls: ['./project-show-admin.component.css']
})
export class ProjectShowAdminComponent implements OnInit {



  public infosUser: UserModel = new UserModel();

  public ObjetProject: ProjectModel = new ProjectModel();

  // public ObjetProjectTemplate: templteProjectModel = new templteProjectModel();

  public ObjetProjectTemplate: templteProjectModel = new templteProjectModel();

  public imagesProjects: Array<ImageProjectModel> = [];

  public arrayAdressReseauxSociauxProject: Array<AdressReseauxSociauxProjectModel> = [];

  public ObjetComment: commentProjectModel = new commentProjectModel();

  public listCommentsForProject: Array<commentProjectModel> = [];

  public listeStatusProject: Array<StatutProjectModel> = [];

  public showForValidation = false;

  public indexStatut;

  public statutProject;

  public photoUserAdmin = './assets/img/users/user_f.png';

  public polling: any;

  public pollingComment: any;

  public page = 1;

  public pageSize = 4;

  public collectionSize = 0;

  public checkInvest = false;

  public showTextera = false;

  public objectQuestionsAidesByAdminForUser: QuestionRepProjectByAdminForUserModel = new QuestionRepProjectByAdminForUserModel();

  public listQuestionsAidesByAdminForUser: Array<QuestionRepProjectByAdminForUserModel> = [];

  public listQuestionsAidesByUserForAdmin: Array<QuestionRepProjectByUserForAdminModel> = [];

  public listQuestionsAidesByUserByAdmin: Array<any> = [];

  public listQuestionsAidesByUserForUser: Array<QuestionRepProjectByUserForUserModel> = [];

  public listInvestor: Array<InvestiteurProjectModel> = [];

  public pageBis = 1;

  public pageSizeBis = 4;

  public collectionSizeBis = 0;

  public listFonsInvest: Array<fondInvestor> = [];

     /*************************************************************** */

   barChartOptions: ChartOptions = {
      responsive: true,
     };
   barChartType: ChartType = 'bar';
   barChartLegend = true;
   barChartPlugins = [];

   barChartLabelsHearts: Label[] = [];
   barChartDataHearts: ChartDataSets[] = [  { data: [], label: 'Nombre de coup de coeur ' } ];

   barChartLabelsVues: Label[] = [];
   barChartDataVues: ChartDataSets[] = [  { data: [], label: 'Nombre de vue de coeur ' } ];

   barChartLabelsLikes: Label[] = [];
   barChartDataLikes: ChartDataSets[] = [  { data: [], label: 'Nombre de likes de coeur ' } ];

   barChartLabelsDislikes: Label[] = [];
   barChartDataDislikes: ChartDataSets[] = [  { data: [], label: 'Nombre de dsilikes de coeur ' } ];

/********************************************************************* */

/********************************************************************* */

barChartLabelsDaysHearts: Label[] = [];
barChartDataDaysHearts: ChartDataSets[] = [  { data: [], label: 'Nombre de coup de coeur ' } ];

barChartLabelsDaysVues: Label[] = [];
barChartDataDaysVues: ChartDataSets[] = [  { data: [], label: 'Nombre de vue  ' } ];

barChartLabelsDaysLikes: Label[] = [];
barChartDataDaysLikes: ChartDataSets[] = [  { data: [], label: 'Nombre de likes  ' } ];

barChartLabelsDaysDislikes: Label[] = [];
barChartDataDaysDislikes: ChartDataSets[] = [  { data: [], label: 'Nombre de dsilikes  ' } ];


/********************************************************************* */

public isShowChartsMens = true;

public isShowChartsDays = false;

public isShowFormSelectDays = false;

public datePickerConfig = {
                    drops: 'down',
                    format: 'YYYY',
                    monthFormat: 'YYYY',
                    locale: 'fr',
                    addClass: 'form-control'
 };

 public datePickerConfigBis = {
   drops: 'down',
   format: 'MM',
   monthFormat: 'MM',
   locale: 'fr',
   addClass: 'form-control'
 };

public ObjetOptionStatMonth: { year: string , month: string} = {year : '', month : ''};

public listYearProject = [];

public listNewsProject: Array<NewsProjectModel> = [];


/********************************************************************* */

public montantCommision = 0;

public showActionCommision = false;

public objectCommissionProject: CommissionProjectModel = new CommissionProjectModel();

  constructor(private router: Router, private route: ActivatedRoute, private cookie: CookieService,
              private apiService: apiHttpSpringBootService, private ngxService: NgxUiLoaderService,
              private datePipe: DatePipe, public sanitizer: DomSanitizer, private titleService: Title) {



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

              this.getinfosProject(params.token);

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

  ngOnInit(): void { }

  getListNewsProject(){


    this.listNewsProject = [];

    this.apiService.getListNewsProjectByUser(this.ObjetProjectTemplate.project).subscribe((arrayNewsProject: Array<NewsProjectModel>) => {


       this.listNewsProject = arrayNewsProject;

       // tslint:disable-next-line:prefer-for-of
       for (let index = 0; index < this.listNewsProject.length; index++) {

          this.listNewsProject[index].description = this.listNewsProject[index].description.substr(3);

          // tslint:disable-next-line:max-line-length
          this.listNewsProject[index].description = this.listNewsProject[index].description.substr(0, this.listNewsProject[index].description.length - 4);


       }

       this.listNewsProject = this.listNewsProject.sort((c1, c2) => c2.timestamp - c1.timestamp);


    }, (error: any) => { });

 }

  getinfosProject(tokenProject) {


    this.ngxService.start();

    this.apiService.getDataProject(tokenProject).subscribe((dataPorject: ProjectModel) => {

      // console.log('dataPorject = ', dataPorject);

      this.ObjetProjectTemplate.project = dataPorject;

      this.titleService.setTitle('Fiche-projet [' + this.ObjetProjectTemplate.project.nom + ']');

      const dateCurrent = new Date();

      const dateProject = new Date(dataPorject.created_at);

      for (let index = 0; index <= dateCurrent.getFullYear() - dateProject.getFullYear(); index++) {

        // alert(dateProject.getFullYear() + index);

        this.listYearProject.push(dateProject.getFullYear() + index);

     }

      if (this.ObjetProjectTemplate.project.description.indexOf('<p>') >= 0){

      this.ObjetProjectTemplate.project.description = this.ObjetProjectTemplate.project.description.substr(3);

      }

      if (this.ObjetProjectTemplate.project.description.indexOf('</p>') >= 0){

      // tslint:disable-next-line:max-line-length
      this.ObjetProjectTemplate.project.description = this.ObjetProjectTemplate.project.description.substring(0, this.ObjetProjectTemplate.project.description.length - 4 );
      }

      this.getListArrayAdressReseauxSociauxProject();

      this.getAllImageProject();

      this.getInfosUser();

      this.getListCommentsProject();

      this.getListQuestionsAidesForInvestor();

      this.getListInvestorByProject();

      this.getAllFondsInvest();

      this.getStatustiquesHeartsChart();

      this.getStatustiquesVuesChart();

      this.getStatustiquesLikesChart();

      this.getStatustiquesDislikesChart();

      this.getListNewsProject();

      this.checkCommisionProject();

      this.montantCommision = dataPorject.total_fonds * 0.05;

      /******************************************************** */

      if (!this.ObjetProjectTemplate.project.manager_project) {

        this.getListStatutProject();

        this.showForValidation = true;

      }


      /******************************************************** */

      this.getListCommentsProject();

   /*   this.pollingComment = setInterval(() => {

        this.getListCommentsProject();

      }, 10 * 1000); */

      /**************************************************** */

      this.getListQuestionsAides();

  /*    this.polling = setInterval(() => {

        this.getListQuestionsAides();

        this.getListQuestionsAidesForInvestor();

        this.getListInvestorByProject();

        this.getAllFondsInvest();

      }, 10 * 1000); */


      /******************************************************** */

      this.ngxService.stop();


    }, (error: any) => {

      this.ngxService.stop();
    });


  }

  checkCommisionProject(){


  // this.ObjetProjectTemplate.project._statut_project.id ===  5 = etat project termine

    // tslint:disable-next-line:max-line-length
    this.apiService.checkCommissionProjectByAdmin(this.infosUser, this.ObjetProjectTemplate.project ).subscribe((dataArrayCommission: Array<CommissionProjectModel>) => {

      console.log('checkCommisionProject-id-statutProject = ', this.ObjetProjectTemplate.project._statut_project.id);

      if (dataArrayCommission.length <= 0 && this.ObjetProjectTemplate.project._statut_project.id ===  5){


          this.showActionCommision = true;

      }


   }, (error: any) => {

    if (this.ObjetProjectTemplate.project._statut_project.id ===  5){

      this.showActionCommision = true;
    }

     });

  }

  addCommisionProject(){


    const date = new Date();

    this.objectCommissionProject.date_created = date.toLocaleString('fr-FR', {
                                                                             weekday: 'long',
                                                                             year: 'numeric',
                                                                             month: 'long',
                                                                             day: 'numeric',
                                                                             hour: 'numeric',
                                                                             minute: 'numeric',
                                                                             second: 'numeric',

    });

    this.objectCommissionProject.amount = this.montantCommision;

    this.objectCommissionProject.timestamp = Date.now();

    this.objectCommissionProject._project = this.ObjetProjectTemplate.project;

    this.objectCommissionProject.manager_project = this.infosUser;

    // tslint:disable-next-line:max-line-length
    this.apiService.addCommissionProjectByAdmin(this.infosUser, this.ObjetProjectTemplate.project, this.objectCommissionProject ).subscribe((dataArrayCommission: Array<CommissionProjectModel>) => {

      if (dataArrayCommission.length <= 0){


          this.showActionCommision = true;

      }


   }, (error: any) => {    });




  }

  onSelectMonthStatisMonth(value){



    console.log('this.ObjetOptionStatDays.month =', this.ObjetOptionStatMonth.month);

    console.log('this.ObjetOptionStatDays.year =', this.ObjetOptionStatMonth.year);



    this.getStatustiquesHeartsDaysChart();

    this.getStatustiquesVueDaysChart();

    this.getStatustiquesLikeDaysChart();

    this.getStatustiquesDislikeDaysChart();

    this.isShowChartsDays = true;



 }

 onChangeTypeStatistique(value){


     // console.log('value = ', value);

     if (value === 'month'){

         this.isShowChartsDays = false;

         this.isShowChartsMens = true;

         this.isShowFormSelectDays = false;

     }

     if (value === 'day'){

       this.isShowChartsDays = false;

       this.isShowFormSelectDays = true;

       this.isShowChartsMens = false;

    }

 }

 getStatustiquesLikeDaysChart(){

    this.barChartDataDaysLikes[0].data = [];

    this.barChartLabelsDaysLikes = [];

    // tslint:disable-next-line:max-line-length
    this.apiService.getStatistiquesLikeMonthChartsByUser(this.ObjetOptionStatMonth, this.ObjetProjectTemplate.project, this.infosUser).subscribe((dataArrayLike: Array<StatistiquesChartsLikeModel>) => {

       dataArrayLike.forEach(element => {

          console.log(element);

          /*********************************************** */

          this.barChartDataDaysLikes[0].data.push(element.nbrLikes);

          this.barChartLabelsDaysLikes.push(element.day);


   });


    }, (error: any) => {    });



}


getStatustiquesDislikeDaysChart(){

 this.barChartDataDaysDislikes[0].data = [];

 this.barChartLabelsDaysDislikes = [];

 // tslint:disable-next-line:max-line-length
 this.apiService.getStatistiquesDislikeMonthChartsByUser(this.ObjetOptionStatMonth, this.ObjetProjectTemplate.project, this.infosUser).subscribe((dataArrayDislike: Array<StatistiquesChartsDislikesModel>) => {

    dataArrayDislike.forEach(element => {

       console.log(element);

       /*********************************************** */

       this.barChartDataDaysDislikes[0].data.push(element.nbrDislikes);

       this.barChartLabelsDaysDislikes.push(element.day);


});


 }, (error: any) => {    });



}


 getStatustiquesVueDaysChart(){

    this.barChartDataDaysVues[0].data = [];

    this.barChartLabelsDaysVues = [];

       // tslint:disable-next-line:max-line-length
    this.apiService.getStatistiquesVuesMonthChartsByUser(this.ObjetOptionStatMonth, this.ObjetProjectTemplate.project, this.infosUser).subscribe((dataArrayVue: Array<StatistiquesChartsVueModel>) => {

          dataArrayVue.forEach(element => {

             console.log(element);

             /*********************************************** */

             this.barChartDataDaysVues[0].data.push(element.nbrVues);

             this.barChartLabelsDaysVues.push(element.day);


      });


       }, (error: any) => {    });



 }

 getStatustiquesHeartsDaysChart(){

    this.barChartDataDaysHearts[0].data = [];

    this.barChartLabelsDaysHearts = [];


    // tslint:disable-next-line:max-line-length
    this.apiService.getStatistiquesHeartsMonthChartsByUser(this.ObjetOptionStatMonth, this.ObjetProjectTemplate.project, this.infosUser).subscribe((dataArrayHeart: Array<StatistiquesChartsHeartModel>) => {

       dataArrayHeart.forEach(element => {

          console.log(element);

          /*********************************************** */

          this.barChartDataDaysHearts[0].data.push(element.nbrHearts);

          this.barChartLabelsDaysHearts.push(element.day);


   });


    }, (error: any) => {    });

 }


  getStatustiquesHeartsChart(){


    // tslint:disable-next-line:max-line-length
    this.apiService.getStatistiquesHeartsChartsByUser(this.ObjetProjectTemplate.project, this.infosUser).subscribe((dataArrayHeart: Array<StatistiquesChartsHeartModel>) => {

       dataArrayHeart.forEach(element => {

          console.log(element);

          /*********************************************** */

          this.barChartDataHearts[0].data.push(element.nbrHearts);

          this.barChartLabelsHearts.push(element.month);


   });


    }, (error: any) => {


   });

 }

 getStatustiquesVuesChart(){


    // tslint:disable-next-line:max-line-length
    this.apiService.getStatistiquesVuesChartsByUser(this.ObjetProjectTemplate.project, this.infosUser).subscribe((dataArrayVue: Array<StatistiquesChartsVueModel>) => {

       dataArrayVue.forEach(element => {

          console.log(element);

          /*********************************************** */

          this.barChartDataVues[0].data.push(element.nbrVues);

          this.barChartLabelsVues.push(element.month);


   });


    }, (error: any) => {


   });

 }

 getStatustiquesLikesChart(){


    // tslint:disable-next-line:max-line-length
    this.apiService.getStatistiquesLikesChartsByUser(this.ObjetProjectTemplate.project, this.infosUser).subscribe((dataArrayLike: Array<StatistiquesChartsLikeModel>) => {

       dataArrayLike.forEach(element => {

          console.log(element);

          /*********************************************** */

          this.barChartDataLikes[0].data.push(element.nbrLikes);

          this.barChartLabelsLikes.push(element.month);


   });


    }, (error: any) => {


   });

 }

 getStatustiquesDislikesChart(){


    // tslint:disable-next-line:max-line-length
    this.apiService.getStatistiquesDislikesChartsByUser(this.ObjetProjectTemplate.project, this.infosUser).subscribe((dataArrayDislikes: Array<StatistiquesChartsDislikesModel>) => {

       dataArrayDislikes.forEach(element => {

          console.log(element);

          /*********************************************** */

          this.barChartDataDislikes[0].data.push(element.nbrDislikes);

          this.barChartLabelsDislikes.push(element.month);


   });


    }, (error: any) => {


   });

 }


  getListQuestionsAidesForInvestor() {


    this.listQuestionsAidesByUserForUser = [];



    /*************************************************************************************** */


    // tslint:disable-next-line:max-line-length
    this.apiService.getListQuestionReponsesByUserForUser(this.ObjetProjectTemplate.project).subscribe((dataQuestion: any) => {

      console.log('dataQuestion', dataQuestion);

      // tslint:disable-next-line:prefer-for-of
      for (let index = 0; index < dataQuestion.length; index++) {


        if (dataQuestion[index]._userExp.photoUser === '' || !dataQuestion[index]._userExp.photoUser) {

          if (dataQuestion[index]._userExp.sex === 'F') {

            dataQuestion[index]._userExp.photoUser = './assets/img/users/user_f.png';


          }

          if (dataQuestion[index]._userExp.sex === 'H') {

            dataQuestion[index]._userExp.photoUser = './assets/img/users/user_m.png';


          }

        }

        this.listQuestionsAidesByUserForUser.push(dataQuestion[index]);


      }

      console.log('listQuestionsAidesByUserForUser', this.listQuestionsAidesByUserForUser);

      this.listQuestionsAidesByUserForUser = this.listQuestionsAidesByUserForUser.sort((c1, c2) => c2.timestamp - c1.timestamp);


    }, (error: any) => {

    });



  }

  getListInvestorByProject() {

    this.listInvestor = [];


    this.apiService.getListInvestorByProject(this.ObjetProjectTemplate.project).subscribe((dataInvestor: any) => {

      console.log('dataInvestor', dataInvestor);

      // tslint:disable-next-line:prefer-for-of
      for (let index = 0; index < dataInvestor.length; index++) {



        if (dataInvestor[index]._userProjectInvest.photoUser === '') {

          if (dataInvestor[index]._userProjectInvest.sex === 'F') {

            dataInvestor[index]._userProjectInvest.photoUser = './assets/img/users/user_f.png';


          }

          if (dataInvestor[index]._userProjectInvest.sex === 'H') {

            dataInvestor[index]._userProjectInvest.photoUser = './assets/img/users/user_m.png';


          }

        }

        this.listInvestor.push(dataInvestor[index]);

      }




    }, (error: any) => { });


  }

  getAllFondsInvest() {

    this.listFonsInvest = [];

    // tslint:disable-next-line:max-line-length
    this.apiService.getAllFondsInvestByProject(this.ObjetProjectTemplate.project).subscribe((arrayFondsInvestor: Array<fondInvestor>) => {

      // tslint:disable-next-line:prefer-for-of
      for (let index = 0; index < arrayFondsInvestor.length; index++) {



        if (arrayFondsInvestor[index]._investisseurProject._userProjectInvest.photoUser === '') {

          if (arrayFondsInvestor[index]._investisseurProject._userProjectInvest.sex === 'F') {

            arrayFondsInvestor[index]._investisseurProject._userProjectInvest.photoUser = './assets/img/users/user_f.png';


          }

          if (arrayFondsInvestor[index]._investisseurProject._userProjectInvest.sex === 'H') {

            arrayFondsInvestor[index]._investisseurProject._userProjectInvest.photoUser = './assets/img/users/user_m.png';


          }

        }

        this.listFonsInvest.push(arrayFondsInvestor[index]);

      }



      console.log(arrayFondsInvestor);

    }, (error: any) => {

    });

  }

  getListArrayAdressReseauxSociauxProject() {


    this.apiService.getListArrayAdressReseauxSociauxProject(this.ObjetProjectTemplate.project).subscribe((data: any) => {


      console.log('data-Adress-sociaux', data);

      this.arrayAdressReseauxSociauxProject = data;

    }, (error: any) => {

    });

  }

  getListStatutProject() {


    this.apiService.getListStatutProject().subscribe((data: Array<StatutProjectModel>) => {


      console.log('data-ListStatutProject', data);

      this.listeStatusProject = data;

    }, (error: any) => {

    });

  }

  getListCommentsProject() {

    this.listCommentsForProject = [];

    /*************************************************************************************** */

    // recuperer la liste des questions envoye par l'investor (id-admin ='1' ) pour le compagny owner

    // tslint:disable-next-line:max-line-length
    this.apiService.getListArrayCommentsProject(this.ObjetProjectTemplate.project).subscribe((dataComments: any) => {

      console.log('dataComments', dataComments);

      // tslint:disable-next-line:prefer-for-of
      for (let index = 0; index < dataComments.length; index++) {



        if (dataComments[index]._user.photoUser === '') {

          if (dataComments[index]._user.sex === 'F') {

            dataComments[index]._user.photoUser = './assets/img/users/user_f.png';


          }

          if (dataComments[index]._user.sex === 'H') {

            dataComments[index]._user.photoUser = './assets/img/users/user_m.png';


          }

        }

        this.listCommentsForProject.push(dataComments[index]);

      }

      console.log('listCommentsForProject', this.listCommentsForProject);

      this.listCommentsForProject = this.listCommentsForProject.sort((c1, c2) => c2.timestamp - c1.timestamp);


    }, (error: any) => {

    });



    //  this.listCommentsForProject = this.listCommentsForProject.sort((c1, c2) => c2.timestamp - c1.timestamp);



    /************************************************************************************ */




  }

  onChangeStatutProject() {

    // this.ngxService.start();

    console.log('indexStatut', this.indexStatut);

    this.ObjetProjectTemplate.project._statut_project = this.listeStatusProject[this.indexStatut];


    this.ObjetProjectTemplate.project.manager_project = this.infosUser;

    this.apiService.updateDataProjectByAdmin(this.ObjetProjectTemplate.project).subscribe((dataProject: ProjectModel) => {

      console.log('updateStautProject = ', dataProject);

    }, (error: any) => { });

  }



  getInfosUser() {


    if (this.ObjetProjectTemplate.project._user.photoUser === '') {

      if (this.ObjetProjectTemplate.project._user.sex === 'F') {

        this.ObjetProjectTemplate.project._user.photoUser = './assets/img/users/user_f.png';


      }

      if (this.ObjetProjectTemplate.project._user.sex === 'H') {

        this.ObjetProjectTemplate.project._user.photoUser = './assets/img/users/user_m.png';


      }

    }


  }

  getAllImageProject() {


    this.apiService.getAllImagesByIdProject(this.ObjetProjectTemplate.project).subscribe((dataImages: Array<ImageProjectModel>) => {

      console.log(dataImages);

      this.imagesProjects = dataImages;

    }, (error: any) => {

    });

  }

  formaterProject() {

    /******************************************************** */

    /*  this.apiService.getPorteProjectById(this.ObjetProject.portes_projectId).subscribe((dataPorte: any) => {

        // console.log(data);

        this.ObjetProjectTemplate.portes_project = dataPorte.nom;

        }, (error: any) => {

       }); */

    /****************************************************** */

    //   this.ObjetProjectTemplate.date_limite_collecte = this.datePipe.transform(this.ObjetProject.date_limite_collecte, 'dd-MM-yyyy');


    /******************************************************* */

    /*  this.apiService.getCategorieProject(this.ObjetProject.categorie_projectId).subscribe((dataCatgorie: any) => {

        // console.log(data);

        this.ObjetProjectTemplate.categorie_project = dataCatgorie.nom;

        }, (error: any) => {

       }); */


    /******************************************************* */

    /*  if (this.ObjetProject.statut_project === 0 ){


        this.ObjetProjectTemplate.statut_project = 'Attente';

       }

      if (this.ObjetProject.statut_project === 1){


        this.ObjetProjectTemplate.statut_project = 'Validé';

       }

      if (this.ObjetProject.statut_project === 2){


        this.ObjetProjectTemplate.statut_project = 'Terminé';

       }

      if (this.ObjetProject.statut_project === 3){


        this.ObjetProjectTemplate.statut_project = 'Annulé';

       } */


    /******************************************************* */



  }

  onFormSubmitQuestionForUser() {

    const date = new Date();

    this.objectQuestionsAidesByAdminForUser.dateCreated = date.toLocaleString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',

    });

    this.objectQuestionsAidesByAdminForUser.timestamp = Date.now();

    this.objectQuestionsAidesByAdminForUser._project = this.ObjetProjectTemplate.project;

    this.objectQuestionsAidesByAdminForUser._userAdminExp = this.infosUser;

    this.objectQuestionsAidesByAdminForUser._userProjectDest = this.ObjetProjectTemplate.project._user;


    // tslint:disable-next-line:max-line-length
    this.apiService.createQuestionReponsesByAdminForUser(this.infosUser, this.objectQuestionsAidesByAdminForUser).subscribe((dataQuestion: QuestionRepProjectByAdminForUserModel) => {

      console.log('createQuestionReponsesByAdminForUser = ', dataQuestion);

      this.getListQuestionsAides();


    }, (error: any) => { });

  }

  getListQuestionsAides() {

    this.listQuestionsAidesByUserByAdmin = [];

    /*************************************************************************************** */

    // recuperer la liste des questions envoye par l'admin (id-admin ='1' ) pour le compagny owner

    // tslint:disable-next-line:max-line-length
    this.apiService.getListQuestionReponsesByAdminForUser( this.ObjetProjectTemplate.project).subscribe((arrayQuestionByAdminForUser: Array<QuestionRepProjectByAdminForUserModel>) => {

      console.log('arrayQuestionByAdminForUser', arrayQuestionByAdminForUser);

      // tslint:disable-next-line:prefer-for-of
      for (let index = 0; index < arrayQuestionByAdminForUser.length; index++) {

        this.listQuestionsAidesByUserByAdmin.push(arrayQuestionByAdminForUser[index]);


      }

      console.log('listQuestionsAidesByUserByAdmin', this.listQuestionsAidesByUserByAdmin);

      this.listQuestionsAidesByUserByAdmin = this.listQuestionsAidesByUserByAdmin.sort((c1, c2) => c2.timestamp - c1.timestamp);


    }, (error: any) => {

    });


    /************************************************************************************ */

    // recuperer la liste des questions envoyer  par le company-owner  en vers l'admin () id-admin ='1')

    // tslint:disable-next-line:max-line-length
    this.apiService.getListQuestionReponsesByUserForAdmin(this.ObjetProjectTemplate.project).subscribe((arrayQuestionByUserForAdmin: Array<QuestionRepProjectByUserForAdminModel>) => {

      console.log('dataQuestion', arrayQuestionByUserForAdmin);

      // tslint:disable-next-line:prefer-for-of
      for (let indexBis = 0; indexBis < arrayQuestionByUserForAdmin.length; indexBis++) {

        this.listQuestionsAidesByUserByAdmin.push(arrayQuestionByUserForAdmin[indexBis]);


      }

      console.log('listQuestionsAidesForConsiller', this.listQuestionsAidesByUserByAdmin);

      this.listQuestionsAidesByUserByAdmin = this.listQuestionsAidesByUserByAdmin.sort((c1, c2) => c2.timestamp - c1.timestamp);



    }, (error: any) => { });



    /************************************************************************************ */




  }

}
