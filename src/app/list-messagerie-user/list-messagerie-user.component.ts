import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute} from '@angular/router';
import { apiHttpSpringBootService } from './../api-spring-boot.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import {UserModel, MessageInterneModel} from '../interfaces/models';

import { IpServiceService } from './../ip-service.service';


@Component({
  selector: 'app-list-messagerie-user',
  templateUrl: './list-messagerie-user.component.html',
  styleUrls: ['./list-messagerie-user.component.css']
})
export class ListMessagerieUserComponent implements OnInit {

  public infosUser: UserModel = new UserModel();

  public polling: any;

  public page = 1;

  public pageSize = 4;

  public collectionSize = 0;

  public listMessagesRecus: Array<MessageInterneModel> = [];

  public listMessagesEnvoyes: Array<MessageInterneModel> = [];

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

                  this.getAllMessagesRecus();

                  this.getAllMessagesEnvoyes();


                  console.log('ProfilUserComponent', this.infosUser);


               }else{

                  this.router.navigate(['/Identification']);

               }

        }

  ngOnInit(): void {  }

  getAllMessagesRecus(){

    this.listMessagesRecus = [];

    this.apiService.getListMessagesRecusByUser(this.infosUser).subscribe((arrayMessagesRecus: Array<MessageInterneModel>) => {


       this.listMessagesRecus = arrayMessagesRecus;

       this.listMessagesRecus = this.listMessagesRecus.sort((c1, c2) => c2.timestamp - c1.timestamp);


    }, (error: any) => { });

  }

  getAllMessagesEnvoyes(){

    this.listMessagesEnvoyes = [];

    this.apiService.getListMessagesEnvoyesByUser(this.infosUser).subscribe((arrayMessagesRecus: Array<MessageInterneModel>) => {


       this.listMessagesEnvoyes = arrayMessagesRecus;

       this.listMessagesEnvoyes = this.listMessagesEnvoyes.sort((c1, c2) => c2.timestamp - c1.timestamp);


    }, (error: any) => { });

  }

}
