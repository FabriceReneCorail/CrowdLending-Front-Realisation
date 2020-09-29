import { Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import {Router} from '@angular/router';
import { apiHttpSpringBootService } from './../api-spring-boot.service';
import { ImageService } from './../image.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import {ImageProjectModel, StatutProjectModel, AdressReseauxSociauxProjectModel, UserModel, ProjectModel   } from '../interfaces/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2/dist/sweetalert2.js';

declare var window: any;



@Component({
  selector: 'app-project-add-company-owner',
  templateUrl: './project-add-company-owner.component.html',
  styleUrls: ['./project-add-company-owner.component.css']
})
export class ProjectAddCompanyOwnerComponent implements OnInit {



     public infosUser: UserModel = new UserModel();

     public ObjetProject: ProjectModel = new ProjectModel();

     public   statutProject: StatutProjectModel = new StatutProjectModel();


     public photosProject: Array<ImageProjectModel> = [];

     public imageFile: File;

     public isErreurValidProject = false;

     public comptImagesProject = 0;

     public listCategorieProject = [];

     public listPorteProject = [];

     public adressReseauxSociauxProject: Array<AdressReseauxSociauxProjectModel> = [];

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

     datePickerConfig = {
                        drops: 'up',
                        format: 'DD-MM-YYYY',
                        locale: 'fr',
                        addClass: 'form-control',
     };

     public addProjectForm: FormGroup;

     public submitted = false;

     public checkContrePartie = false;

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

    public srcImageAfficheProject = 'http://placehold.it/500x325';


     constructor(private formBuilder: FormBuilder, private router: Router, private cookie: CookieService,
                 private apiService: apiHttpSpringBootService, private imageService: ImageService,
                 private ngxService: NgxUiLoaderService, private datePipe: DatePipe, private titleService: Title) {

                  this.titleService.setTitle('ajouter un projet');

                  if (this.cookie.get('infosUser')){

                    this.infosUser = JSON.parse(this.cookie.get('infosUser'));

                    this.ObjetProject._user = this.infosUser;

                    this.ObjetProject.afficheProject = 'http://placehold.it/500x325';

                    this.statutProject.id = 1;

                    this.statutProject.nom = 'Attente';

                    this.ObjetProject._statut_project = this.statutProject;

                    if (this.infosUser.photoUser === '' || !this.infosUser.photoUser){

                   if (this.infosUser.sex === 'F') {

                            this.infosUser.photoUser = './assets/img/users/user_f.png';


                      }

                   if (this.infosUser.sex === 'H') {

                        this.infosUser.photoUser = './assets/img/users/user_m.png';


                    }



                 }

                    console.log('ProfilUserComponent', this.infosUser);


                  }else{

                    this.router.navigate(['/Identification']);
                  }


  }

  tinyAlert(message: string){

        Swal.fire(message);
  }

  ngOnInit(): void {


    this.addProjectForm = this.formBuilder.group({
                                                nomProject: ['', Validators.required],
                                                descriptionProject: ['', Validators.required],
                                                porteProject : ['', Validators.required],
                                                categorieProject : ['', Validators.required],
                                                // tslint:disable-next-line:max-line-length
                                                montantMinimunProject : ['', [Validators.required, Validators.min(1)]],
                                                dateLimitCollectProject : ['', [Validators.required, Validators.pattern('[0-9]{2}-[0-9]{2}-[0-9]{4}')]],
                                              //  contrePartieProject: ['', Validators.required],
       });



    this.getListCategorieProject();

    this.getListPorteProject();

  }

  get f() { return this.addProjectForm.controls; }





  addEventDateLimiteCollecte(event){

    const date = new Date();

    if (event < date){

           this.isErreurValidProject = true;

           this.tinyAlert('La date limite de projet doit etre superieur à la date actuelle !!!');
    }else{

      this.isErreurValidProject = false;

      this.ObjetProject.date_limite_collecte = this.datePipe.transform(event.value, 'yyyy-MM-dd');

      console.log(this.ObjetProject.date_limite_collecte);

    }

  }

  handleChange(value){

    this.ObjetProject.contrePartieProject = value;

    this.checkContrePartie = false;

  }

  addImageProject(objectImage: ImageProjectModel){

    this.apiService.addImageProject(objectImage).subscribe((data: any) => {

      console.log('data-image-project', data);


    }, (error: any) => {

    });


  }

  deleteImageByProject(indexProject: number){

     this.photosProject.splice(indexProject, 1);



  }

  onChangeCategorieProject(index){


    console.log('objectCategorie', this.listCategorieProject[index]);

    this.ObjetProject.categoryProject = this.listCategorieProject[index];
  }

  onChangePorteProject(index){


    console.log('objectPorte', this.listPorteProject[index]);

    this.ObjetProject._porte_project = this.listPorteProject[index];
  }

  onFormSubmitAddProject(){

    this.submitted = true;



    if (this.ObjetProject.contrePartieProject === undefined){

      this.checkContrePartie = true;
     }

    // console.log("f.porteProject.errors.required = ", this.f.porteProject.errors.required);

    // console.log("f.porteProject.errors = ", this.f.porteProject.errors);

         // stop here if form is invalid
    if (this.addProjectForm.invalid) {
             return;
         }

     // console.log("this.ObjetProject.contrePartieProject = ", this.ObjetProject.contrePartieProject);

     // console.log("this.isvalidCaptcha = ", this.isvalidCaptcha);

     // console.log("!this.isErreurValidProject = ", !this.isErreurValidProject);

    if (this.ObjetProject.contrePartieProject     &&  !this.checkContrePartie){

      this.ObjetProject.total_fonds = 0;

      this.apiService.addProjectByCompanyOwner(this.ObjetProject).subscribe((data: any) => {

        console.log(data.id);

        this.ObjetProject = data;

        /*************************************************************** */

        if (this.photosProject.length > 0){

             // tslint:disable-next-line:prefer-for-of
             for (let index = 0; index < this.photosProject.length; index++) {

                 this.photosProject[index]._project = this.ObjetProject;

                 this.addImageProject( this.photosProject[index]);
             }
        }

         /*************************************************************** */

        if (this.adressReseauxSociauxProject.length > 0){

          // tslint:disable-next-line:prefer-for-of
          for (let index = 0; index < this.adressReseauxSociauxProject.length; index++) {

              this.adressReseauxSociauxProject[index]._project = this.ObjetProject;

              this.addAdressReseauSocialProject( this.adressReseauxSociauxProject[index]);
          }
       }



          /*************************************************************** */

        this.router.navigate(['/user-my-projetcs']);


       }, (error: any) => {

      });


     }

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

        this.adressReseauxSociauxProject.push(objectLinkMedia);

       // this.ObjetProject.adressReseauxSociauxProject = this.adressReseauxSociauxProject;

        console.log(objectLinkMedia);


      }


    }else{

      this.tinyAlert('Veuillez saisir le url de votre type de media svp !!!');
    }


  }else{

      this.tinyAlert('Veuillez choisir un type de media svp !!!');

  }


}

removeAdressWeb(index){

  if (confirm('Vous ete sure de supprimer ladresse ')) {

    this.adressReseauxSociauxProject.splice(index, 1);

  }


}



onChangeTypeMediaProject(event){


     console.log(event);


}

deleteMediaByProject(indexObjectAdresse , objectAdresse){



}

  addAdressReseauSocialProject(objectadress: AdressReseauxSociauxProjectModel){

    this.apiService.addAdressReseauSocialProject(objectadress).subscribe((data: any) => {

         console.log('service-addAdressReseauSocialProject', data);

    }, (error: any) => {  });
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

        this.photosProject.push(newObjectPhoto);

        this.comptImagesProject++;

        this.ngxService.stop();

       });

    }else{

      this.tinyAlert('Veuillez telecharger une image svp');
    }


  }


  addImageAfficheProject(){

    if (this.imageFile){

      this.ngxService.start();

      const infoObjectphotos = {
                      title: 'image_affiche_project',
                      description:  'image_affiche_project'
            };



      this.imageService.uploadImage(this.imageFile, infoObjectphotos).then((imageData: any) => {

      console.log(imageData.data.link);

      this.ObjetProject.afficheProject = imageData.data.link;

      this.srcImageAfficheProject = imageData.data.link;

      this.ngxService.stop();


     });


    }else{

      this.tinyAlert('Veuillez telecharger une image svp');
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

}
