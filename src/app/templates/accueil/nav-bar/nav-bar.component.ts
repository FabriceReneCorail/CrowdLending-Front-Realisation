import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { UserModel } from 'src/app/interfaces/models';


declare var navigator: any;

@Component({
  selector: 'app-nav-bar-accueil',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarAccueilComponent implements OnInit {
  public userLang: any;

  public infosUser: UserModel;

  constructor(
    public translate: TranslateService,
    private cookie: CookieService
  ) {
    translate.addLangs(['en', 'fr', 'es']);

    if (this.cookie.get('lang_translat_user')) {
      const langTranslat = this.cookie.get('lang_translat_user');

      translate.setDefaultLang(langTranslat);
    } else {
      this.userLang = navigator.language || navigator.userLanguage;

      translate.setDefaultLang(this.userLang);
    }
  }

  ngOnInit() {
    this.keepInfo();
  }

  switchLang(lang: string) {
    this.translate.use(lang);

    this.cookie.set('lang_translat_user', lang);
  }

  keepInfo() {
    if (this.cookie.get('infosUser')) {
      console.log(JSON.parse(this.cookie.get('infosUser')));
      return (this.infosUser = JSON.parse(this.cookie.get('infosUser')));
    } else {
      this.infosUser;
    }
  }

  deconnexion(){
      this.cookie.delete('infosUser');
      console.log(this.cookie.delete('infosUser'));
  }
}
