import { Component, OnInit, ElementRef, ViewChild, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { apiHttpSpringBootService } from './../api-spring-boot.service';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserModel } from '../interfaces/models';
import Swal from 'sweetalert2/dist/sweetalert2.js';
@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.css']
})
export class ConnectionComponent implements OnInit {
  public infosUser: UserModel = new UserModel();

  public ObjetInscription: UserModel = new UserModel();

  public isErreurLogin = false;

  public isErreurInscription = false;

  public isvalidLogin = false;

  public isvalidInscription = false;

  public ObjetLogin = {
    emailLogin: '',
    passwordLogin: ''
  };

  constructor(private route: ActivatedRoute, private router: Router, private apiService: apiHttpSpringBootService,
    private cookie: CookieService, private datePipe: DatePipe, private ngxService: NgxUiLoaderService,
    private titleService: Title) { }

  ngOnInit(): void {
  }

  public onFormSubmitLogin() {

    /* this.cookie.set('infosConnectionUser', JSON.stringify(this.ObjetLogin));

     this.router.navigate(['/captcha-identification']); */

    this.ngxService.start();


    this.apiService.identificationUser(this.ObjetLogin).subscribe((dataUser: UserModel) => {

      // console.log('IdentificationComponent/identification', dataUser);

      if (!dataUser) {

        this.isErreurLogin = true;

      } else {

        this.infosUser = dataUser;


        this.cookie.set('infosUser', JSON.stringify(this.infosUser));

        this.router.navigate(['/profilUser']);


      }

      this.ngxService.stop();


    }, (error: any) => { });

  }



}
