import { Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute} from '@angular/router';
import { ImageService } from './../image.service';
import { apiHttpSpringBootService } from './../api-spring-boot.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import {UserModel, ProjectModel, ProjectModelBis, templteProjectModelBis,
       ImageProjectModel, AdressReseauxSociauxProjectModel} from '../interfaces/models';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2/dist/sweetalert2.js';



declare var window: any;

@Component({
  selector: 'app-project-edit-company-owner',
  templateUrl: './project-edit-company-owner.component.html',
  styleUrls: ['./project-edit-company-owner.component.css']
})
export class ProjectEditCompanyOwnerComponent implements OnInit {

 @ViewChild('recaptcha', {static: true }) recaptchaElement: ElementRef;

  public infosUser: UserModel = new UserModel();

  public ObjetProject: ProjectModel = new ProjectModel();

  public ObjetProjectTemplate: templteProjectModelBis = new templteProjectModelBis();

  public imagesProjects: Array<ImageProjectModel> = [];

  public arrayAdressReseauxSociauxProject: Array<AdressReseauxSociauxProjectModel> = [];

  public listCategorieProject = [];

  public listPorteProject = [];

  public listeStatusProject = [
                         { key: 1, value: 'Valider le porjet' },
                         { key: 2, value: 'Terminer le porjet' },
                         { key: 3, value: 'Annuler le porjet' }
  ];

  public statutProject;

  public photoUserAdmin = './assets/img/users/user_f.png';

  public updateProjectForm: FormGroup;

  public submitted = false;

  public checkContrePartie = false;

  private isvalidCaptcha = true ;  // test

  public isErreurCaptcha = false;

  public isErreurValidProject = false;

  public isValidDateCollecte = true;  // tester la validite de date de limite de collecte

  datePickerConfig = {
                    drops: 'up',
                    format: 'DD-MM-YYYY',
                    locale: 'fr',
                     addClass: 'form-control',
  };

  public flagRadio;

  public imageFile: File;

  public photosProject: Array<ImageProjectModel> = [];

  public typeMediaWeb: any = '';

  public listCanalMedia = [

                          {key: 'site_internet/Site internet', value: 'Site internet'},
                          {key: 'link_google_plus/Google plus', value: 'Google plus'},
                          {key: 'link_facbook/Face-book', value: 'Face-book'},
                          {key: 'link_youtube/Youtube', value: 'Youtube'},
                          {key: 'link_twitter/Twitter', value: 'Twitter'},
                          {key: 'num_tel/Numero téléphone', value: 'Numero téléphone'},

  ];

  public linkProject = '';

  // tslint:disable-next-line:ban-types
  public options: Object = {
                         charCounterCount: true,
                         attribution: false,
                         placeholderText: 'Décrivez brièvement votre projet *',
                         heightMin: 200
  /*  toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat', 'alert'],
    toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat', 'alert'],
    toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat', 'alert'],
    toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat', 'alert'],*/
  };

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private cookie: CookieService,
              private apiService: apiHttpSpringBootService, private ngxService: NgxUiLoaderService,
              private datePipe: DatePipe, public sanitizer: DomSanitizer,
              private imageService: ImageService, private titleService: Title ) {

              this.titleService.setTitle('editer-projet');

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


  tinyAlert(message: string){

    Swal.fire(message);
  }


  ngOnInit(): void {


    this.updateProjectForm = this.formBuilder.group({
                                                   nomProject: [ '', Validators.required],
                                                  // descriptionProject: ['', Validators.required],
                                                   porteProject : ['', Validators.required],
                                                   categorieProject : ['', Validators.required],
                                                   // tslint:disable-next-line:max-line-length
                                                   montantMinimunProject : ['', [Validators.required, Validators.min(1)]],
                                                   dateLimitCollectProject : ['', [Validators.required, Validators.pattern('[0-9]{2}-[0-9]{2}-[0-9]{4}')]],
                                                   //  contrePartieProject: ['', Validators.required],
                         });

    this.addRecaptchaScript();

    this.getListCategorieProject();

    this.getListPorteProject();
  }

  onChangeDateLimiteCollecte(event){

    const date = new Date();

    if (event < date){

           this.isValidDateCollecte = false;

           this.tinyAlert('La date limite de projet doit etre superieur à la date actuelle !!!');
    }else{

      this.isValidDateCollecte = true;

      this.ObjetProject.date_limite_collecte = this.datePipe.transform(event.value, 'yyyy-MM-dd');

      console.log(this.ObjetProject.date_limite_collecte);

    }

  }

  imageInputChange(imageInput: any) {

    this.imageFile = imageInput.files[0];

  }

  addImage() {

    if (this.imageFile){

      this.ngxService.start();

      const infoObjectphotos = {
                        title: 'images_project',
                        description:  'images_project'
                      };



      this.imageService.uploadImage(this.imageFile, infoObjectphotos).then((imageData: any) => {

        console.log(imageData.data.link);

        const newObjectPhoto: ImageProjectModel = new ImageProjectModel();


        newObjectPhoto.link = imageData.data.link;

        newObjectPhoto._project = this.ObjetProject;

        this.addPhotoForBdd(newObjectPhoto);

        this.ngxService.stop();

       });


    }else{

      this.tinyAlert('Veuillez telecharger une image svp');
    }

  }

  deleteImageByProject(indexImage: number, objectPhoto: ImageProjectModel ){

    this.apiService.deleteImageProject(objectPhoto).subscribe((data: any) => {

      console.log('data-image-project', data);

      this.imagesProjects.splice(indexImage, 1);


    }, (error: any) => {

    });

  }


  addPhotoForBdd(objectPhoto: ImageProjectModel){

    this.apiService.addImageProject(objectPhoto).subscribe((data: any) => {

      console.log('data-image-project', data);

      this.imagesProjects.push(objectPhoto);


    }, (error: any) => {

    });



  }

  updateImageAfficheProject(){

    if (this.imageFile){

      this.ngxService.start();

      const infoObjectphotos = {
                        title: 'image_affiche_project',
                        description:  'image_affiche_project'
              };



      this.imageService.uploadImage(this.imageFile, infoObjectphotos).then((imageData: any) => {

        console.log(imageData.data.link);

        this.ObjetProject.afficheProject = imageData.data.link;

        this.ngxService.stop();


       });

    }else{

      this.tinyAlert('Veuillez telecharger une image svp');

    }



  }


  get f() { return this.updateProjectForm.controls; }

  onFormSubmitUpdateProject(){

   this.submitted = true;

   // console.log('this.flagRadio = ', this.flagRadio);

   if (this.flagRadio === 0){

       this.ObjetProject.contrePartieProject = 'Du concret';

   }else if (this.flagRadio === 1){

       this.ObjetProject.contrePartieProject = 'Principalement du symbolique';

   }else if (this.flagRadio === 2){

    this.ObjetProject.contrePartieProject = 'Pas de contrepartie';

   }else if (this.flagRadio === 3){

      this.ObjetProject.contrePartieProject = 'Je ne sais pas encore';
    }

   if (!this.isvalidCaptcha){

       this.isErreurCaptcha = true;
    }

   if (this.ObjetProject.contrePartieProject === undefined){

      this.checkContrePartie = true;
     }

    // this.checkDateLimiteCollecte();

   if (this.updateProjectForm.invalid) {
      return;
    }

    // console.log('this.ObjetProject.contrePartieProject = ', this.ObjetProject.contrePartieProject);

   console.log('this.ObjetProject.porteProject.id = ', this.ObjetProject._porte_project.id);

   if (this.ObjetProject.contrePartieProject  && this.isvalidCaptcha    &&  !this.checkContrePartie  && this.isValidDateCollecte){

      this.apiService.updateDataProjectByUser(this.ObjetProject).subscribe((data: any) => {

        this.tinyAlert('Votre enregistrement a été éffectué par succées');

      }, (error: any) => { });



   }



  }

  getListCategorieProject(){

   this.apiService.getListCategorieProject().subscribe((data: any) => {

     console.log(data);

     this.listCategorieProject = data;


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

  getinfosProject(tokenProject) {

     this.ngxService.start();

     this.apiService.getDataProject(tokenProject).subscribe((dataPorject: ProjectModel) => {

          console.log('dataPorject = ', dataPorject);

        //  this.ObjetProjectTemplate.project = dataPorject;

          this.ObjetProject =  dataPorject;

          if (this.ObjetProject.contrePartieProject === 'Du concret'){

            this.flagRadio = 0;

          }else if (this.ObjetProject.contrePartieProject === 'Principalement du symbolique'){

            this.flagRadio = 1;

          }else if (this.ObjetProject.contrePartieProject === 'Pas de contrepartie'){

            this.flagRadio = 2;

           }else if (this.ObjetProject.contrePartieProject === 'Je ne sais pas encore'){

            this.flagRadio = 3;
          }


          this.getListArrayAdressReseauxSociauxProject();

          this.getAllImageProject();

          this.ngxService.stop();


     }, (error: any) => {

        this.ngxService.stop();
      });


    }

    addRecaptchaScript() {

      window.grecaptchaCallback = () => {
        this.renderReCaptcha();
      };

      (function(d, s, id, obj){
        let js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) { obj.renderReCaptcha(); return; }
        js = d.createElement(s); js.id = id;
        js.src = 'https://www.google.com/recaptcha/api.js?onload=grecaptchaCallback&amp;render=explicit';
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'recaptcha-jssdk', this));

    }

    renderReCaptcha() {
      window.grecaptcha.render(this.recaptchaElement.nativeElement, {
        sitekey: '6Lf4I6gZAAAAAMp1E9YI1FJghdQ20CNRtAV9d55y',
        callback: (response) => {
            console.log('response', response);

            this.isvalidCaptcha = true;

            this.isErreurCaptcha = false;
        }
      });
    }



  getListArrayAdressReseauxSociauxProject() {


   this.apiService.getListArrayAdressReseauxSociauxProject(this.ObjetProject).subscribe((data: any) => {


          console.log('data-Adress-sociaux', data);

          this.arrayAdressReseauxSociauxProject = data;

     }, (error: any) => {

     });

  }

  deleteMediaByProject(indexObjectAdresse , objectAdresse){

    this.apiService.deleteAdressReseauSocialProject(objectAdresse).subscribe((data: any) => {


      console.log('data-Adress-sociaux', data);

      this.arrayAdressReseauxSociauxProject.splice(indexObjectAdresse, 1);



     }, (error: any) => { });



  }

  onChangeTypeMediaProject(event){





  }

  addAdressWeb(){

    if (this.typeMediaWeb){

      if (this.linkProject){

        const arrayMedia = this.typeMediaWeb.split('/');

        let checkControlValueMedia = true;

        if (arrayMedia[0] === 'site_internet'){

          // test ok

          const regexphtpp = new RegExp('^((http|https)://){1}(www[.])?([a-zA-Z0-9]|-)+([.][a-zA-Z0-9(-|/|=|?)?]+)+$');

          if (!regexphtpp.test(this.linkProject)){

            checkControlValueMedia = false;

            this.tinyAlert('Votre url est invalide.!!!');

          }

        }else if (arrayMedia[0] === 'link_google_plus'){

          // tslint:disable-next-line:max-line-length
          //  http(s)?:\/\/(www\.)?google\.(com|ad|ae|com.af|com.ag|com.ai|al|am|co.ao|com.ar|as|at|com.au|az|ba|com.bd|be|bf|bg|com.bh|bi|bj|com.bn|com.bo|com.br|bs|bt|co.bw|by|com.bz|ca|cd|cf|cg|ch|ci|co.ck|cl|cm|cn|com.co|co.cr|com.cu|cv|com.cy|cz|de|dj|dk|dm|com.do|dz|com.ec|ee|com.eg|es|com.et|fi|com.fj|fm|fr|ga|ge|gg|com.gh|com.gi|gl|gm|gp|gr|com.gt|gy|com.hk|hn|hr|ht|hu|co.id|ie|co.il|im|co.in|iq|is|it|je|com.jm|jo|co.jp|co.ke|com.kh|ki|kg|co.kr|com.kw|kz|la|com.lb|li|lk|co.ls|lt|lu|lv|com.ly|co.ma|md|me|mg|mk|ml|com.mm|mn|ms|com.mt|mu|mv|mw|com.mx|com.my|co.mz|com.na|com.nf|com.ng|com.ni|ne|nl|no|com.np|nr|nu|co.nz|com.om|com.pa|com.pe|com.pg|com.ph|com.pk|pl|pn|com.pr|ps|pt|com.py|com.qa|ro|ru|rw|com.sa|com.sb|sc|se|com.sg|sh|si|sk|com.sl|sn|so|sm|sr|st|com.sv|td|tg|co.th|com.tj|tk|tl|tm|tn|to|com.tr|tt|com.tw|co.tz|com.ua|co.ug|co.uk|com.uy|co.uz|com.vc|co.ve|vg|co.vi|com.vn|vu|ws|rs|co.za|co.zm|co.zw|cat)\/.*/

          const regexpgoogle = new RegExp('http(s)?:\/\/(www\.)?google\.(com|ad|ae|com.af|com.ag|com.ai|al|am|co.ao|com.ar|as|at|com.au|az|ba|com.bd|be|bf|bg|com.bh|bi|bj|com.bn|com.bo|com.br|bs|bt|co.bw|by|com.bz|ca|cd|cf|cg|ch|ci|co.ck|cl|cm|cn|com.co|co.cr|com.cu|cv|com.cy|cz|de|dj|dk|dm|com.do|dz|com.ec|ee|com.eg|es|com.et|fi|com.fj|fm|fr|ga|ge|gg|com.gh|com.gi|gl|gm|gp|gr|com.gt|gy|com.hk|hn|hr|ht|hu|co.id|ie|co.il|im|co.in|iq|is|it|je|com.jm|jo|co.jp|co.ke|com.kh|ki|kg|co.kr|com.kw|kz|la|com.lb|li|lk|co.ls|lt|lu|lv|com.ly|co.ma|md|me|mg|mk|ml|com.mm|mn|ms|com.mt|mu|mv|mw|com.mx|com.my|co.mz|com.na|com.nf|com.ng|com.ni|ne|nl|no|com.np|nr|nu|co.nz|com.om|com.pa|com.pe|com.pg|com.ph|com.pk|pl|pn|com.pr|ps|pt|com.py|com.qa|ro|ru|rw|com.sa|com.sb|sc|se|com.sg|sh|si|sk|com.sl|sn|so|sm|sr|st|com.sv|td|tg|co.th|com.tj|tk|tl|tm|tn|to|com.tr|tt|com.tw|co.tz|com.ua|co.ug|co.uk|com.uy|co.uz|com.vc|co.ve|vg|co.vi|com.vn|vu|ws|rs|co.za|co.zm|co.zw|cat)\/.*/');

          if (!regexpgoogle.test(this.linkProject)){

            checkControlValueMedia = false;

            this.tinyAlert('Votre url est invalide.!!!');

          }

        }else if (arrayMedia[0] === 'link_facbook'){

          // https://www.facebook.com/   //test ok

         // tslint:disable-next-line:max-line-length
         //    /^(https?:\/\/)?(www\.)?facebook.com\/[a-zA-Z0-9(\.\?)?]/

         const regexpfacebook = new RegExp('(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w\-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w\-]*)?');

         if (!regexpfacebook.test(this.linkProject)){

           checkControlValueMedia = false;

           this.tinyAlert('Votre url est invalide.!!!');

         }


        }else if (arrayMedia[0] === 'link_youtube'){

             // tslint:disable-next-line:max-line-length
             //    ^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$

             const regexpyoutube = new RegExp('^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$');

             if (!regexpyoutube.test(this.linkProject)){

                    checkControlValueMedia = false;

                    this.tinyAlert('Votre url est invalide.!!!');

              }


        }else if (arrayMedia[0] === 'link_twitter'){

          // '/^(?:https?:\/\/)?(?:www\.)?twitter\.com\/(#!\/)?[a-zA-Z0-9_]+$/i'

          const regexptwitter = new RegExp('/^(?:https?:\/\/)?(?:www\.)?twitter\.com\/(#!\/)?[a-zA-Z0-9_]+$/i');

          if (!regexptwitter.test(this.linkProject)){

                    checkControlValueMedia = false;

                    this.tinyAlert('Votre url est invalide.!!!');

           }

        }else if (arrayMedia[0] === 'num_tel'){

          // test ok

          /*************************************************************************** */

          if (this.linkProject.indexOf('+33') !== -1){

             this.linkProject = this.linkProject.replace('(+33)', '0');

             // alert("toto");
          }

          console.log('this.linkProject = ', this.linkProject);

          const regexTel = new RegExp(/^(01|02|03|04|05|06|07|08|09)[0-9]{8}/g);

          console.log(regexTel.test(this.linkProject));

          console.log(regexTel.test(this.linkProject) === false);

          if (regexTel.test(this.linkProject) === false){

            checkControlValueMedia = false;

            this.tinyAlert('Votre numero tel est invalide.exemple de saisie : 0685748546-bis');

          }


          /************************************************************************ */

       }

        if (checkControlValueMedia){


          const objectLinkMedia: AdressReseauxSociauxProjectModel = new AdressReseauxSociauxProjectModel();

          objectLinkMedia.keyMedia = arrayMedia[0];

          objectLinkMedia.valueMedia = arrayMedia[1];

          objectLinkMedia.linkProject = this.linkProject;

          objectLinkMedia._project = this.ObjetProject;

          this.apiService.addAdressReseauSocialProject(objectLinkMedia).subscribe((data: any) => {

            console.log('data-image-project', data);

            this.arrayAdressReseauxSociauxProject.push(objectLinkMedia);


          }, (error: any) => {

          });


          console.log(objectLinkMedia);


        }


      }else{

        this.tinyAlert('Veuillez saisir le url de votre type de media svp !!!');
      }


    }else{

        this.tinyAlert('Veuillez choisir un type de media svp !!!');

    }


  }


 getAllImageProject() {


    this.apiService.getAllImagesByIdProject(this.ObjetProject).subscribe((dataImages: Array<ImageProjectModel>) => {

        console.log(dataImages);

        this.imagesProjects = dataImages;

        }, (error: any) => {

       });



  }

 formaterProject(){

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


}
