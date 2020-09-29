import { Component, OnInit, ElementRef, ViewChild, EventEmitter} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { apiHttpSpringBootService } from './../api-spring-boot.service';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Title } from '@angular/platform-browser';

declare var window: any;

@Component({
  selector: 'app-identification-admin',
  templateUrl: './identification-admin.component.html',
  styleUrls: ['./identification-admin.component.css']
})
export class IdentificationAdminComponent implements OnInit {

  @ViewChild('recaptcha', {static: true }) recaptchaElement: ElementRef;



  public ObjetLogin = {
                  emailLogin : '',
                  passwordLogin : ''
   };
   

    public infosUser = {
                        id : '',
                        nom: '',
                        prenom : '',
                        login : '',
                        password : '',
                        sex : '',
                        photoUser : '',
                        date_naissance : '',
                        date_created: '',
                        date_update: '',
                        token : '',
                        typeCompte : 'admin'
   };

  public isErreurLogin = false;


  public isvalidLogin = false; 

  private isvalidCaptcha = false ;

  public isErreurCaptcha = false;

  events: string[] = [];


  constructor(private route: ActivatedRoute, private router: Router, private apiService: apiHttpSpringBootService,
              private cookie: CookieService, private datePipe: DatePipe,
              private ngxService: NgxUiLoaderService, private titleService: Title) {

                this.titleService.setTitle('Espace-identification');
   /* this.route.params.subscribe(params => {

      alert(params['action']);

    }) */

  }

  ngOnInit(): void {

    this.addRecaptchaScript();

    const date = new Date();

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

  public onFormSubmitLogin() {

    this.ngxService.start();

    if(this.isvalidCaptcha){

      this.apiService.identificationAdmin(this.ObjetLogin).subscribe((data: any) => {

        console.log('IdentificationComponent/identification', data);

        if (!data){

               this.isErreurLogin = true;

        }else{

          console.log('toto2');

          this.infosUser.id =  data.id;

          this.infosUser.nom =  data.nom;

          this.infosUser.prenom =  data.prenom;

          this.infosUser.login =  data.login;

          this.infosUser.password =  data.password;

          this.infosUser.photoUser =  data.photoUser;

          this.infosUser.sex =  data.sex;

          this.infosUser.date_naissance =  data.date_naissance;

          this.infosUser.date_created =  data.date_created;

          this.infosUser.date_update =  data.date_update;

          this.infosUser.typeCompte =  data.typeCompte;

          this.infosUser.token =  data.token;


          this.cookie.set('infosUser', JSON.stringify(this.infosUser));

          this.router.navigate(['/profilUser']);


      }

        this.ngxService.stop();


    }, (error: any) => {

    });

   }

  }

}
