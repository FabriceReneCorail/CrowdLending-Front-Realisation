import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-nav-admin-templates',
  templateUrl: './nav-templates.component.html',
  styleUrls: ['./nav-templates.component.css']
})
export class NavTemplatesAdministratorComponent implements OnInit {

  public infosUser = {
                     id : '',
                     nom: '',
                     prenom : '',
                     login : '',
                     password : '',
                     sex : '',
                     photoUser : '',
                     typeCompte : ''
    };

 public urlImageProfil: string;

 public tagSearchGlobal = '' ;


constructor(private router: Router, private cookie: CookieService) {

  this.infosUser = JSON.parse(this.cookie.get('infosUser'));

  if (this.infosUser.photoUser === ''){

    if (this.infosUser.sex === 'F') {

      this.infosUser.photoUser = './assets/img/users/user_f.png';

      this.urlImageProfil = './assets/img/users/user_f.png';
    }

    if (this.infosUser.sex === 'H') {

      this.infosUser.photoUser = './assets/img/users/user_m.png';

      this.urlImageProfil = './assets/img/users/user_m.png';
      }

  }else{

    this.urlImageProfil = this.infosUser.photoUser;

  }

  
 }

ngOnInit(): void { }

searchGlobalProjectsByMotCle(){

  this.router.navigate(['/admin-search-projetcs-by-tag', {search: this.tagSearchGlobal}]);

}

}
