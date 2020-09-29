import { Component, OnInit, ElementRef, ViewChild, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { apiHttpSpringBootService } from './../api-spring-boot.service';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {UserModel} from '../interfaces/models';

declare var window: any;

@Component({
  selector: 'app-captcha-identification-user',
  templateUrl: './captcha-identification-user.component.html',
  styleUrls: ['./captcha-identification-user.component.css']
})
export class CaptchaIdentificationUserComponent implements OnInit {

  @ViewChild('recaptcha', { static: true }) recaptchaElement: ElementRef;

  public ObjetLogin = {
                     emailLogin: '',
                     passwordLogin: ''
  };

  // public infosUser: UserModel = new UserModel();

  public infosUser = {
                     id: '',
                     nom: '',
    prenom: '',
    login: '',
    password: '',
    sex: '',
    photoUser: '',
    date_naissance: '',
    date_created: '',
    date_update: '',
    token: '',
    typeCompte: 'user'
  };

  constructor(private route: ActivatedRoute, private router: Router, private apiService: apiHttpSpringBootService,
              private cookie: CookieService, private datePipe: DatePipe, private ngxService: NgxUiLoaderService)  {

    if (this.cookie.get('infosConnectionUser')){

      this.ObjetLogin = JSON.parse(this.cookie.get('infosConnectionUser'));

      console.log('this.ObjetLogin = ', this.ObjetLogin);


    }else{

      this.router.navigate(['/Identification']);

    }


  }

  ngOnInit(): void {

     this.addRecaptchaScript();

 }

  addRecaptchaScript() {

    window.grecaptchaCallback = () => {
      this.renderReCaptcha();
    };

    (function(d, s, id, obj) {
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

        this.onFormSubmitLogin();

      }
    });
  }

  public onFormSubmitLogin() {

    this.ngxService.start();


    this.apiService.identificationUser(this.ObjetLogin).subscribe((data: any) => {

      console.log('IdentificationComponent/identification', data);

      if (!data) {

        this.router.navigate(['/Identification']);

      } else {

        console.log('toto2');

        this.infosUser.id = data.id;

        this.infosUser.nom = data.nom;

        this.infosUser.prenom = data.prenom;

        this.infosUser.login = data.login;

        this.infosUser.password = data.password;

        this.infosUser.photoUser = data.photoUser;

        this.infosUser.sex = data.sex;

        this.infosUser.date_naissance = data.date_naissance;

        this.infosUser.date_created = data.date_created;

        this.infosUser.date_update = data.date_update;

        this.infosUser.typeCompte = data.typeCompte;

        this.infosUser.token = data.token;


        this.cookie.set('infosUser', JSON.stringify(this.infosUser));

        setTimeout(function(){
           console.log('setTimeout-5000ms');
         }, 5000);

        this.router.navigate(['/profilUser']);
      }

      this.ngxService.stop();


    }, (error: any) => {

    });


  }

}
