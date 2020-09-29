import { Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import { apiHttpSpringBootService } from './../api-spring-boot.service';
import { DatePipe } from '@angular/common';
import {FormContactModel } from '../interfaces/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare var window: any;

@Component({
  selector: 'app-visitor-form-contact',
  templateUrl: './visitor-form-contact.component.html',
  styleUrls: ['./visitor-form-contact.component.css']
})
export class VisitorFormContactComponent implements OnInit {

  @ViewChild('recaptcha', {static: true }) recaptchaElement: ElementRef;

  public ObjetFormCotact: FormContactModel = new FormContactModel();

  private isvalidCaptcha = false ;

  public isErreurCaptcha = false;

  public successSendMessage = false;

  public contactForm: FormGroup;

  public submitted = false;

  constructor(private formBuilder: FormBuilder, private apiService: apiHttpSpringBootService, private datePipe: DatePipe) { }

  ngOnInit(): void {

    this.contactForm = this.formBuilder.group({
                                             sujet: ['', Validators.required],
                                             email: ['', [Validators.required, Validators.email]],
                                             description: ['', Validators.required]
                                              });

    this.addRecaptchaScript();
   }

   get f() { return this.contactForm.controls; }

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

  onFormSubmitContact(){

   

   this.submitted = true;

   if (!this.isvalidCaptcha){

       this.isErreurCaptcha = true;

   }

        // stop here if form is invalid
   if (this.contactForm.invalid) {
            return;
        }

   if (this.isvalidCaptcha){

          const date = new Date();

          this.ObjetFormCotact.date_created = date.toLocaleString('fr-FR', {
                                                                              weekday: 'long',
                                                                              year : 'numeric',
                                                                              month : 'long',
                                                                              day : 'numeric',
                                                                              hour : 'numeric',
                                                                              minute : 'numeric',
                                                                              second : 'numeric',

                                                                           });

          this.ObjetFormCotact.timestamp_created = Date.now();

          this.apiService.sendFormContact(this.ObjetFormCotact).subscribe((data: any) => {

            console.log(data);

            this.successSendMessage = true;

            this.ObjetFormCotact.email = '';

            this.ObjetFormCotact.description = '';

            this.ObjetFormCotact.sujet = '';



           }, (error: any) => {

          });



        }

   // display form values on success
  // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.contactForm.value, null, 4));

  }

}
