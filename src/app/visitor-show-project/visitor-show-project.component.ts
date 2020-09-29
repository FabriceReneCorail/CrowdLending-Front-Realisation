import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute} from '@angular/router';
import { apiHttpSpringBootService } from './../api-spring-boot.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import {ProjectModelBis, templteProjectModelBis,
       ImageProjectModel, AdressReseauxSociauxProjectModel, commentProjectModel, commentProjectModelBis,
       QuestionRepProjectByUserForUserModelBis, InvestiteurProjectModelBis,
       QuestionRepProjectByUserForUserModel, fondInvestorBis} from '../interfaces/models';

@Component({
  selector: 'app-visitor-show-project',
  templateUrl: './visitor-show-project.component.html',
  styleUrls: ['./visitor-show-project.component.css']
})
export class VisitorShowProjectComponent implements OnInit {


  public ObjetProject: ProjectModelBis = new ProjectModelBis();

 public ObjetProjectTemplate: templteProjectModelBis = new templteProjectModelBis();

  public imagesProjects: Array<ImageProjectModel> = [];

  public arrayAdressReseauxSociauxProject: Array<AdressReseauxSociauxProjectModel> = [];

  public ObjetComment: commentProjectModelBis = new commentProjectModelBis();

  public listCommentsForProject: Array<commentProjectModel> = [];

  public statutProject;

  public polling: any;

  public pollingComment: any;


  public ObjetDemandeInvest: InvestiteurProjectModelBis = new InvestiteurProjectModelBis();

  constructor(private route: ActivatedRoute, private cookie: CookieService, private apiService: apiHttpSpringBootService
             ,private ngxService: NgxUiLoaderService, private datePipe: DatePipe, public sanitizer: DomSanitizer) {


        this.route.params.subscribe(params => {

        this.getinfosProject(params.token);



      });
             }

  ngOnInit(): void {  }

  getinfosProject(tokenProject) {

    this.ngxService.start();

    this.apiService.getDataProject(tokenProject).subscribe((dataPorject: ProjectModelBis) => {

         console.log('dataPorject = ', dataPorject);

         this.ObjetProjectTemplate.project = dataPorject;

         if (this.ObjetProjectTemplate.project.description.indexOf('<p>') >= 0){

          this.ObjetProjectTemplate.project.description = this.ObjetProjectTemplate.project.description.substr(3);

         }

         if (this.ObjetProjectTemplate.project.description.indexOf('</p>') >= 0){

          // tslint:disable-next-line:max-line-length
          this.ObjetProjectTemplate.project.description = this.ObjetProjectTemplate.project.description.substring(0, this.ObjetProjectTemplate.project.description.length - 4 );
         }

         // tslint:disable-next-line:max-line-length
         this.ObjetProjectTemplate.project.date_limite_collecte = this.datePipe.transform(this.ObjetProjectTemplate.project.date_limite_collecte, 'dd-MM-yyyy');

         this.getListArrayAdressReseauxSociauxProject();

         this.getListCommentsProject();

         this.getAllImageProject();


         /******************************************** */

         this.pollingComment = setInterval(() => {

          this.getListCommentsProject();

        }, 300 * 1000);  // 5 minutes


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

 getAllImageProject() {


  this.apiService.getAllImagesByIdProject(this.ObjetProjectTemplate.project).subscribe((dataImages: Array<ImageProjectModel>) => {

      console.log(dataImages);

      this.imagesProjects = dataImages;

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

}
