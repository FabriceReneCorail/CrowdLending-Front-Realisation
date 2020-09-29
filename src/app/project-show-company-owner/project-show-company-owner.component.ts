import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute} from '@angular/router';
import { apiHttpSpringBootService } from './../api-spring-boot.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import {UserModel, ProjectModel, ProjectModelBis, templteProjectModelBis,
       ImageProjectModel, AdressReseauxSociauxProjectModel, commentProjectModel, commentProjectModelBis,
       QuestionRepProjectByUserForUserModelBis, InvestiteurProjectModelBis, LikeProjectUserModel, VueProjectUserModel,
       QuestionRepProjectByUserForUserModel, fondInvestorBis, HeartProjectUserModel, FavorisProjectUserModel, NewsProjectModel} from '../interfaces/models';

import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

import { IpServiceService } from './../ip-service.service';


declare var window: any;



@Component({
   selector: 'app-project-show-company-owner',
   templateUrl: './project-show-company-owner.component.html',
   styleUrls: ['./project-show-company-owner.component.css']
})
export class ProjectShowCompanyOwnerComponent implements OnInit {



   public infosUser: UserModel = new UserModel();

   public ObjetProject: ProjectModelBis = new ProjectModelBis();

  // public ObjetProjectTemplate: templteProjectModel = new templteProjectModel();

  public ObjetProjectTemplate: templteProjectModelBis = new templteProjectModelBis();

   public imagesProjects: Array<ImageProjectModel> = [];

   public arrayAdressReseauxSociauxProject: Array<AdressReseauxSociauxProjectModel> = [];

   public ObjetComment: commentProjectModelBis = new commentProjectModelBis();

   public listCommentsForProject: Array<commentProjectModel> = [];


   public listeStatusProject = [
                          { key: 1, value: 'Valider le porjet' },
                          { key: 2, value: 'Terminer le porjet' },
                          { key: 3, value: 'Annuler le porjet' }
   ];

   public statutProject;

   public photoUserAdmin = './assets/img/users/user_f.png';

   public polling: any;

   public pollingComment: any;

   public page = 1;

   public pageSize = 4;

   public collectionSize = 0;

   public buttonSendDemandeInvest = false;

   public showFormFond = false;

   public showButtonAddFond = false;

   public payPalConfig?: IPayPalConfig;

   public pageBis = 1;

   public pageSizeBis = 4;

   public collectionSizeBis = 0;

   public   fondInvestor: fondInvestorBis = new fondInvestorBis();

   // tslint:disable-next-line:max-line-length
   public   objectQuestionRepProjectByUserForUserModel: QuestionRepProjectByUserForUserModelBis = new QuestionRepProjectByUserForUserModelBis();

   public listQuestionsAidesByUserForUser: Array<QuestionRepProjectByUserForUserModel> = [];

   public ObjetDemandeInvest: InvestiteurProjectModelBis = new InvestiteurProjectModelBis();

   public listInvestor: Array<InvestiteurProjectModelBis> = [];

   public listFonsInvest: Array<fondInvestorBis> = [];

   public objectFavorisProject: FavorisProjectUserModel = new FavorisProjectUserModel();

   public objectHeartProject: HeartProjectUserModel = new HeartProjectUserModel();

   public objectLikeProject: LikeProjectUserModel = new LikeProjectUserModel();

   public objectVueProject: VueProjectUserModel = new VueProjectUserModel();

   public ipAdress = '';

   public listNewsProject: Array<NewsProjectModel> = [];

   constructor(private router: Router, private route: ActivatedRoute, private cookie: CookieService,
               private apiService: apiHttpSpringBootService, private ngxService: NgxUiLoaderService,
               private datePipe: DatePipe, public sanitizer: DomSanitizer, private ip: IpServiceService) {

               if (this.cookie.get('infosUser')){

                  this.infosUser = JSON.parse(this.cookie.get('infosUser'));


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


               }else{

                  this.router.navigate(['/Identification']);

               }


   }

   ngOnInit(): void {

      this.getIP();
   }

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

   getIP() {

    this.ip.getIPAddress().subscribe((res: any) => {

      console.log('infos-ip = ', res.ip) ;

      this.ipAdress =  res.ip;

      this.objectVueProject.ip_adress = res.ip;

    });

  }

  checkVueProject(){


    // tslint:disable-next-line:max-line-length
    this.apiService.checkVueProjectByUser(this.ObjetProjectTemplate.project, this.infosUser).subscribe((dataVue: Array<VueProjectUserModel>) => {

      if (dataVue){

         console.log('dataVue = ', dataVue[0]);

         this.updateVueProject(dataVue[0]);

      }


      }, (error: any) => {

         this.addVueProjectForBdd();
      });
  }

  addVueProjectForBdd(){

   const date = new Date();

   this.objectVueProject._project = this.ObjetProjectTemplate.project;

   this.objectVueProject._user = this.infosUser;

   this.objectVueProject.date_consultation = date.toLocaleString('fr-FR', {
                                                              weekday: 'long',
                                                              year: 'numeric',
                                                              month: 'long',
                                                              day: 'numeric',
                                                              hour: 'numeric',
                                                              minute: 'numeric',
                                                              second: 'numeric',
    });

   this.objectVueProject.date_created = date.toLocaleString('fr-FR', {
                                                                   weekday: 'long',
                                                                   year: 'numeric',
                                                                   month: 'long',
                                                                   day: 'numeric',
                                                                   hour: 'numeric',
                                                                   minute: 'numeric',
                                                                   second: 'numeric',
     });

   this.objectVueProject.timestamp = Date.now();

   this.apiService.addVueProjectByUser(this.objectVueProject).subscribe((dataVue: VueProjectUserModel) => {

      /*********************** Mettre a jour les donnes de la template projet********************************** */


      this.UpdateDataProject(this.ObjetProject.token);

       /********************************************************************************************************** */

      this.ngxService.stop();

   }, (error: any) => {

     this.ngxService.stop();
   });



  }

  updateVueProject(dataVue: VueProjectUserModel){

   const date = new Date();

   dataVue.date_update = date.toLocaleString('fr-FR', {
                                                                     weekday: 'long',
                                                                     year: 'numeric',
                                                                     month: 'long',
                                                                     day: 'numeric',
                                                                     hour: 'numeric',
                                                                     minute: 'numeric',
                                                                     second: 'numeric',
     });

   dataVue.ip_adress = this.ipAdress;

   this.apiService.updateVueProjectByUser(dataVue).subscribe((data: VueProjectUserModel) => {


      /*********************** Mettre a jour les donnes de la template projet********************************** */



      this.UpdateDataProject(this.ObjetProject.token);

    /********************************************************************************************************** */



   }, (error: any) => {  });



  }

   checkLikeProject(paramAction){


      this.ObjetProjectTemplate.likeUsers = './assets/img/like-bis.png';


      this.ObjetProjectTemplate.dislikeUser = './assets/img/dislike-bis.png';


      // tslint:disable-next-line:max-line-length
      this.apiService.checkLikeDislikeProjectByUser(this.ObjetProjectTemplate.project, this.infosUser).subscribe((dataLike: Array<LikeProjectUserModel>) => {

         if (dataLike){

            console.log('dataLike = ', dataLike[0]);

            if (paramAction.update === true){

                this.updateLikeProject(paramAction, dataLike[0]);


            }else{

                  if (dataLike[0].statut_like_project === 'LIKE'){

                     this.ObjetProjectTemplate.likeUsers = './assets/img/like_ico.png';

                  }

                  if (dataLike[0].statut_like_project === 'DISLIKE'){

                     this.ObjetProjectTemplate.dislikeUser = './assets/img/dislike_ico.png';

                  }

            }



         }

    }, (error: any) => {

         if (paramAction.update === true){

              this.addLikeProjectForBdd(paramAction);
         }
     });


  }

  updateLikeProject(paramAction, dataLike: LikeProjectUserModel){

        // console.log('dataLike.statut_like_project =', dataLike.statut_like_project);

        // console.log('dataLike =', dataLike);

        // alert('dataLike-statut =' + dataLike.statut_like_project);

        const statutLike: string = dataLike.statut_like_project;

        if (statutLike === 'LIKE'){

             // alert('toto1');


             if (paramAction.statutLike === 'LIKE'){

                    // supprimer le like de Bdd

                     // alert('LIKE+remove');

                     this.removeLikeProjectForBdd(paramAction, dataLike);

             }

             if (paramAction.statutLike === 'DISLIKE'){

               // Mettre a jour  le like de Bdd

               // alert('DISLIKE+update');

               this.updateLikeProjectForBdd(paramAction, dataLike);

             }



        }

        if (statutLike === 'DISLIKE'){

         // alert('toto2');

         if (paramAction.statutLike === 'LIKE'){

            // Mettre a jour  le like de Bdd

            // alert('LIKE+update');

            this.updateLikeProjectForBdd(paramAction, dataLike);

         }

         if (paramAction.statutLike === 'DISLIKE'){

            // supprimer le like de Bdd

            // alert('DISLIKE+delete');

            this.removeLikeProjectForBdd(paramAction, dataLike);

         }



        }


  }

  updateLikeProjectForBdd(paramAction, dataLike: LikeProjectUserModel){

       const date = new Date();

       dataLike.date_update = date.toLocaleString('fr-FR', {
         weekday: 'long',
         year: 'numeric',
         month: 'long',
         day: 'numeric',
         hour: 'numeric',
         minute: 'numeric',
         second: 'numeric',
       });

       dataLike.timestamp = Date.now();

       dataLike.statut_like_project = paramAction.statutLike;

       this.apiService.updateLikeProjectByUser(dataLike).subscribe((data: LikeProjectUserModel) => {

         if (paramAction.statutLike === 'DISLIKE'){

            // Mettre a jour  le like de Bdd

            this.ObjetProjectTemplate.likeUsers = './assets/img/like-bis.png';

            this.ObjetProjectTemplate.dislikeUser = './assets/img/dislike_ico.png';

          }

         if (paramAction.statutLike === 'LIKE'){

            // Mettre a jour  le like de Bdd

            this.ObjetProjectTemplate.likeUsers = './assets/img/like_ico.png';

            this.ObjetProjectTemplate.dislikeUser = './assets/img/dislike-bis.png';

         }

         /*********************** Mettre a jour les donnes de la template projet********************************** */

         this.UpdateDataProject(this.ObjetProject.token);

       /********************************************************************************************************** */




         this.ngxService.stop();

      }, (error: any) => {

        this.ngxService.stop();
      });





  }

  removeLikeProjectForBdd(paramAction, dataLike: LikeProjectUserModel){

   this.apiService.deleteLikeProjectByUser(dataLike).subscribe((data: any) => {

      if (paramAction.statutLike === 'LIKE'){

         this.ObjetProjectTemplate.likeUsers = './assets/img/like-bis.png';

         this.ObjetProjectTemplate.dislikeUser = './assets/img/dislike-bis.png';

       }

      if (paramAction.statutLike === 'DISLIKE'){

         // supprimer le like de Bdd

         this.ObjetProjectTemplate.likeUsers = './assets/img/like-bis.png';

         this.ObjetProjectTemplate.dislikeUser = './assets/img/dislike-bis.png';

      }

      /*********************** Mettre a jour les donnes de la template projet********************************** */


      this.UpdateDataProject(this.ObjetProject.token);

       /********************************************************************************************************** */

      this.ngxService.stop();

   }, (error: any) => {

     this.ngxService.stop();
   });


  }

  addLikeProjectForBdd(paramAction){

   const date = new Date();

   this.objectLikeProject._project = this.ObjetProjectTemplate.project;

   this.objectLikeProject._user = this.infosUser;

   this.objectLikeProject.date_created = date.toLocaleString('fr-FR', {
                                                              weekday: 'long',
                                                              year: 'numeric',
                                                              month: 'long',
                                                              day: 'numeric',
                                                              hour: 'numeric',
                                                              minute: 'numeric',
                                                              second: 'numeric',
    });

   this.objectLikeProject.timestamp = Date.now();


   this.objectLikeProject.statut_like_project = paramAction.statutLike;

   this.apiService.addLikeProjectByUser(this.objectLikeProject).subscribe((data: LikeProjectUserModel) => {


      if (paramAction.statutLike === 'LIKE'){

         this.ObjetProjectTemplate.likeUsers = './assets/img/like_ico.png';
      }

      if (paramAction.statutLike === 'DISLIKE'){

           this.ObjetProjectTemplate.dislikeUser = './assets/img/dislike_ico.png';
      }

      /*********************** Mettre a jour les donnes de la template projet********************************** */


      this.UpdateDataProject(this.ObjetProject.token);

       /********************************************************************************************************** */

      this.ngxService.stop();

   }, (error: any) => {

     this.ngxService.stop();
   });



  }

   addLikeProject(){

      const paramAction = {update : true, statutLike : 'LIKE'};

      this.checkLikeProject(paramAction);



   }

   addDislikeProject(){

       const paramAction = {update : true, statutLike : 'DISLIKE'};

       this.checkLikeProject(paramAction);

   }

   addHeartProject(){

      const paramAction = {update : true};

      this.checkHeartsProject(paramAction);

   }

   addFavorisProject(){

      const paramAction = {update : true};

      this.checkFavorisProject(paramAction);

   }

   checkFavorisProject(paramAction){

      this.ObjetProjectTemplate.srcFavorisProject = './assets/img/favoris-bis.png';

      this.apiService.checkFavorisProjectByUser(this.ObjetProjectTemplate.project, this.infosUser).subscribe((dataFavoris: any) => {

           if (dataFavoris){

            this.ObjetProjectTemplate.srcFavorisProject = './assets/img/favoris.png';

            if (paramAction.update === true){

              this.deleteFavorisProjectForBdd();

            }

           }



      }, (error: any) => {

           if (paramAction.update === true){

                this.addFavorisProjectForBdd();
           }
       });


  }

  addFavorisProjectForBdd(){

   this.ngxService.start();

   const date = new Date();

   this.objectFavorisProject._project = this.ObjetProjectTemplate.project;

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


      this.ObjetProjectTemplate.srcFavorisProject = './assets/img/favoris.png';

      this.ngxService.stop();

   }, (error: any) => {

     this.ngxService.stop();
   });


 }

  deleteFavorisProjectForBdd(){

   this.ngxService.start();

   this.objectFavorisProject._project = this.ObjetProjectTemplate.project;

   this.objectFavorisProject._user = this.infosUser;

   this.apiService.deleteFavorisProjectByUser(this.objectFavorisProject).subscribe((data: any) => {


      this.ObjetProjectTemplate.srcFavorisProject = './assets/img/favoris-bis.png';

      this.ngxService.stop();

 }, (error: any) => {

   this.ngxService.stop();
 });


 }




   checkHeartsProject(paramAction){

      this.ObjetProjectTemplate.heartUser = './assets/img/heart-icon-bis.png';

      this.apiService.checkHeartProjectByUser(this.ObjetProjectTemplate.project, this.infosUser).subscribe((dataHeart: any) => {

           if (dataHeart){

            this.ObjetProjectTemplate.heartUser = './assets/img/heart-icon.png';

            if (paramAction.update === true){

              this.deleteHeartProjectForBdd();

            }

           }



      }, (error: any) => {

           if (paramAction.update === true){

                 this.addHeartProjectForBdd();
           }
       });


  }

  addHeartProjectForBdd(){

   this.ngxService.start();

   const date = new Date();

   this.objectHeartProject._project = this.ObjetProjectTemplate.project;

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


      this.ObjetProjectTemplate.heartUser = './assets/img/heart-icon.png';



      this.UpdateDataProject(this.ObjetProject.token);

      this.ngxService.stop();

   }, (error: any) => {

     this.ngxService.stop();
   });


 }

  deleteHeartProjectForBdd(){

   this.ngxService.start();

   this.objectHeartProject._project = this.ObjetProjectTemplate.project;

   this.objectHeartProject._user = this.infosUser;

   this.apiService.deleteHeartProjectByUser(this.objectHeartProject).subscribe((data: any) => {


      this.ObjetProjectTemplate.heartUser = './assets/img/heart-icon-bis.png';


      this.UpdateDataProject(this.ObjetProject.token);

      this.ngxService.stop();

 }, (error: any) => {

   this.ngxService.stop();
 });


 }

   UpdateDataProject(tokenProject){


      this.apiService.getDataProject(tokenProject).subscribe((dataPorject: ProjectModelBis) => {

         this.ObjetProjectTemplate.project = dataPorject;

         this.ObjetProject = dataPorject;



      }, (error: any) => {


       });

   }

   getinfosProject(tokenProject) {


         this.ngxService.start();

         const paramAction = {update: false};

         this.apiService.getDataProject(tokenProject).subscribe((dataPorject: ProjectModelBis) => {

           console.log('dataPorject = ', dataPorject);

           this.ObjetProjectTemplate.project = dataPorject;

           this.ObjetProject = dataPorject;

           if (this.ObjetProjectTemplate.project.description.indexOf('<p>') >= 0){

            this.ObjetProjectTemplate.project.description = this.ObjetProjectTemplate.project.description.substr(3);

          }

           if (this.ObjetProjectTemplate.project.description.indexOf('</p>') >= 0){

            // tslint:disable-next-line:max-line-length
            this.ObjetProjectTemplate.project.description = this.ObjetProjectTemplate.project.description.substring(0, this.ObjetProjectTemplate.project.description.length - 4 );
          }

           this.checkHeartsProject(paramAction);

           this.checkFavorisProject(paramAction);

           this.checkLikeProject(paramAction);

           this.checkVueProject();

           this.checkInvestiteurProject();

           this.getListArrayAdressReseauxSociauxProject();

           this.getListCommentsProject();

           this.getAllImageProject();

           this.getListQuestionsAidesForInvestor();

           this.getListInvestorByProject();

           this.getAllFondsInvest();

           this.getListNewsProject();

           /******************************************** */

         /*  this.pollingComment = setInterval(() => {

            this.getListCommentsProject();

          }, 10 * 1000); */

          /***************************************** */

         /*  this.polling = setInterval(() => {

            this.getListQuestionsAidesForInvestor();

            this.getListInvestorByProject();

            this.getAllFondsInvest();

         }, 10 * 1000); */


         /******************************************* */

           this.ngxService.stop();




      }, (error: any) => {

         this.ngxService.stop();
       });


     }



   getListArrayAdressReseauxSociauxProject(){


      this.apiService.getListArrayAdressReseauxSociauxProject(this.ObjetProjectTemplate.project).subscribe((data: any) => {


           console.log('data-Adress-sociaux', data);

           this.arrayAdressReseauxSociauxProject = data;

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


      }, (error: any) => { });



      this.listCommentsForProject = this.listCommentsForProject.sort((c1, c2) => c2.timestamp - c1.timestamp);



      /************************************************************************************ */




    }

   onFormSubmitComment() {

     const date = new Date();

     this.ObjetComment.dateCreated = date.toLocaleString('fr-FR', {
                                                                weekday: 'long',
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                                hour: 'numeric',
                                                                minute: 'numeric',
                                                                second: 'numeric',
      });

     this.ObjetComment.timestamp = Date.now();

     this.ObjetComment._project = this.ObjetProjectTemplate.project;

     this.ObjetComment._user = this.infosUser;


     this.apiService.addCommentProject(this.ObjetComment).subscribe((dataComment: any) => {

        console.log(dataComment);

        this.getListCommentsProject();


      }, (error: any) => {});

    }


   getInfosCompanyOwner() {

      if (this.ObjetProjectTemplate.project._user.photoUser === ''){

         if (this.ObjetProjectTemplate.project._user.sex === 'F') {

           this.ObjetProjectTemplate.project._user.photoUser = './assets/img/users/user_f.png';


           }

         if (this.ObjetProjectTemplate.project._user.sex === 'H') {

           this.ObjetProjectTemplate.project._user.photoUser = './assets/img/users/user_m.png';


            }

      }
   }

   addFondInvestForPorject(){

      this.showFormFond = true;

   }

   checkInvestiteurProject(){


      // tslint:disable-next-line:max-line-length
      this.apiService.checkInvestiteurProject(this.ObjetProjectTemplate.project, this.infosUser).subscribe((dataInvestor: InvestiteurProjectModelBis) => {

         console.log('dataInvestor', dataInvestor);

         if (!dataInvestor){

            this.buttonSendDemandeInvest = true;

         }else{

             // tslint:disable-next-line:max-line-length
             if (dataInvestor.statutDemande === 'VALIDE'  && ( dataInvestor._project._statut_project.nom === 'Valide' || dataInvestor._project._statut_project.nom === 'Renouvele')){


                   this.showButtonAddFond = true;

                   this.fondInvestor._investisseurProject = dataInvestor; // initialisation pour formulaire d'ajout de fonds
             }

         }



       }, (error: any) => {

         this.buttonSendDemandeInvest = true;
       });


   }

   onFormSubmitAddFondByInvestor(){

     // this.saveDataTransactionPaypal(); // test

      this.initConfig();

   }



   private initConfig(): void {
      this.payPalConfig = {
        currency: 'EUR',
        clientId: 'AST3IB2GzDWxt19bQ32sdSA8Qvki6oqZ3EEDEoz_aWbwA3AVtwzUsRu6jjoVw9ajRYthH7YbCd9hkaNC',  // compte test develop paypal
        // tslint:disable-next-line:whitespace
        // tslint:disable-next-line:no-angle-bracket-type-assertion
        createOrderOnClient: (data) => <ICreateOrderRequest> <unknown> {
           intent: 'CAPTURE',
           purchase_units: [
              {
                 amount: {
                    currency_code: 'EUR',
                    value: this.fondInvestor.amount,
                    breakdown: {
                       item_total: {
                          currency_code: 'EUR',
                          value: this.fondInvestor.amount
                       }
                    }
                 },
                 items: [
                    {
                       name: 'fond de projet' + this.ObjetProjectTemplate.project.nom,
                       quantity: '1',
                       category: 'DIGITAL_GOODS',
                       unit_amount: {
                          currency_code: 'EUR',
                          value: this.fondInvestor.amount,
                       },
                    }
                 ]
              }
           ]
        },
        advanced: {
          commit: 'true'
        },
        style: {
          label: 'paypal',
          layout: 'vertical'
        },
        onApprove: (data, actions) => {
          console.log('onApprove - transaction was approved, but not authorized', data, actions);
          actions.order.get().then(details => {
            console.log('onApprove - you can get full order details inside onApprove: ', details);

            this.saveDataTransactionPaypal();
          });
        },
        onClientAuthorization: (data) => {
          console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
          // this.showSuccess = true;
        },
        onCancel: (data, actions) => {
          console.log('OnCancel', data, actions);
        },
        onError: err => {
          console.log('OnError', err);
        },
        onClick: (data, actions) => {
          console.log('onClick', data, actions);
        },
      };
    }

    saveDataTransactionPaypal() {

      const date = new Date();

      this.fondInvestor.dateCreated = date.toLocaleString('fr-FR', {
                                                                weekday: 'long',
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                                hour: 'numeric',
                                                                minute: 'numeric',
                                                                second: 'numeric',
      });

      this.fondInvestor.timestamp = Date.now();

      this.fondInvestor._user = this.infosUser ;

      this.fondInvestor._project = this.ObjetProjectTemplate.project;

      this.apiService.saveDataTransactionPaypal(this.fondInvestor).subscribe((datapay: fondInvestorBis) => {

        console.log('datapay', datapay);

        this.showFormFond = false;

        this.getAllFondsInvest();

      }, (error: any) => {

      });


    }

   getListInvestorByProject(){

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

     getAllFondsInvest(){

      this.listFonsInvest = [];

      // tslint:disable-next-line:max-line-length
      this.apiService.getAllFondsInvestByProject(this.ObjetProjectTemplate.project).subscribe((arrayFondsInvestor: Array<fondInvestorBis>) => {

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

     sendDemandeInvest(){

      const date = new Date();

      this.ObjetDemandeInvest._project = this.ObjetProjectTemplate.project;

      this.ObjetDemandeInvest._userProjectInvest = this.infosUser;

      this.ObjetDemandeInvest.date_created = date.toLocaleString('fr-FR', {
         weekday: 'long',
         year: 'numeric',
         month: 'long',
         day: 'numeric',
         hour: 'numeric',
         minute: 'numeric',
         second: 'numeric',
      });

      this.ObjetDemandeInvest.timestamp = Date.now();

      this.apiService.sendDemandeInvestorByProject(this.infosUser,  this.ObjetDemandeInvest).subscribe((dataSend: any) => {

         console.log(dataSend);

         this.getAllFondsInvest();

      }, (error: any) => {

      });


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

    /*  if (this.ObjetProject.statut_project === 0) {


         this.ObjetProjectTemplate.statut_project = 'Attente';

      }

      if (this.ObjetProject.statut_project === 1) {


         this.ObjetProjectTemplate.statut_project = 'Validé';

      }

      if (this.ObjetProject.statut_project === 2) {


         this.ObjetProjectTemplate.statut_project = 'Terminé';

      }

      if (this.ObjetProject.statut_project === 3) {


         this.ObjetProjectTemplate.statut_project = 'Annulé';

      } */

      /******************************************************* */

   }

   replyByPorteurProjectForInvestFor(objectquestionUser){

      this.objectQuestionRepProjectByUserForUserModel._userDest = objectquestionUser;

   }



   onFormSubmitQuestionForUser(){


      const date = new Date();

      this.objectQuestionRepProjectByUserForUserModel.dateCreated = date.toLocaleString('fr-FR', {
         weekday: 'long',
         year: 'numeric',
         month: 'long',
         day: 'numeric',
         hour: 'numeric',
         minute: 'numeric',
         second: 'numeric',

      });

      this.objectQuestionRepProjectByUserForUserModel._project = this.ObjetProjectTemplate.project;

      this.objectQuestionRepProjectByUserForUserModel.timestamp = Date.now();


      this.objectQuestionRepProjectByUserForUserModel._userExp = this.infosUser;

      /****************************************************************************** */

      if (this.ObjetProjectTemplate.project._user.photoUser === ''  || !this.ObjetProjectTemplate.project._user.photoUser) {

         if (this.ObjetProjectTemplate.project._user.sex === 'F') {

            this.ObjetProjectTemplate.project._user.photoUser = './assets/img/users/user_f.png';


         }

         if (this.ObjetProjectTemplate.project._user.sex === 'H') {

            this.ObjetProjectTemplate.project._user.photoUser = './assets/img/users/user_m.png';


         }

      }

       /****************************************************************************** */

      this.objectQuestionRepProjectByUserForUserModel._userDest = this.ObjetProjectTemplate.project._user;

      // tslint:disable-next-line:max-line-length
      this.apiService.createQuestionReponsesByUserForUser(this.infosUser, this.objectQuestionRepProjectByUserForUserModel).subscribe((dataQuestion: any) => {

         // console.log(_dataQuestion);

          this.getListQuestionsAidesForInvestor();


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


      if (dataQuestion[index]._userExp.photoUser === ''  || !dataQuestion[index]._userExp.photoUser) {

         if (dataQuestion[index]._userExp.sex === 'F') {

            dataQuestion[index]._userExp.photoUser = './assets/img/users/user_f.png';


         }

         if (dataQuestion[index]._userExp.sex === 'H') {

            dataQuestion[index]._userExp.photoUser = './assets/img/users/user_m.png';


         }

      }

      if (dataQuestion[index]._userDest.photoUser === ''  || !dataQuestion[index]._userDest.photoUser) {

         if (dataQuestion[index]._userDest.sex === 'F') {

            dataQuestion[index]._userDest.photoUser = './assets/img/users/user_f.png';


         }

         if (dataQuestion[index]._userDest.sex === 'H') {

            dataQuestion[index]._userDest.photoUser = './assets/img/users/user_m.png';


         }

      }

      this.listQuestionsAidesByUserForUser.push(dataQuestion[index]);


         }

         console.log('listQuestionsAidesByUserForUser', this.listQuestionsAidesByUserForUser);

         this.listQuestionsAidesByUserForUser = this.listQuestionsAidesByUserForUser.sort((c1, c2) => c2.timestamp - c1.timestamp);


      }, (error: any) => {

      });



   }



}
