import { Component, OnInit, trigger, state, style, transition, animate, Output, EventEmitter, ViewChildren, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { NavbarTitleService } from '../lbd/services/navbar-title.service';
import {  Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../services/auth-guard.service';
import { UserService } from '../services/user.service';
import { NotificationService, NotificationType, NotificationOptions } from '../lbd/services/notification.service';
import * as vars from '../config';
import { AppComponent } from '../app.component';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { CompleterCmp, CompleterItem, CompleterService, CompleterData, RemoteData } from 'ng2-completer';
import { Observable } from "rxjs/Observable";
import { Http, Headers, URLSearchParams, RequestOptions, Jsonp } from '@angular/http';
import { CustomData } from "../services/custom-data";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('carduserprofile', [
      state('*', style({
        '-ms-transform': 'translate3D(0px, 0px, 0px)',
        '-webkit-transform': 'translate3D(0px, 0px, 0px)',
        '-moz-transform': 'translate3D(0px, 0px, 0px)',
        '-o-transform': 'translate3D(0px, 0px, 0px)',
        transform: 'translate3D(0px, 0px, 0px)',
        opacity: 1
      })),
      transition('void => *', [
        style({opacity: 0,
          '-ms-transform': 'translate3D(0px, 150px, 0px)',
          '-webkit-transform': 'translate3D(0px, 150px, 0px)',
          '-moz-transform': 'translate3D(0px, 150px, 0px)',
          '-o-transform': 'translate3D(0px, 150px, 0px)',
          transform: 'translate3D(0px, 150px, 0px)',
        }),
        animate('0.3s 0s ease-out'),
      ])
    ]),
    trigger('cardprofile', [
      state('*', style({
        '-ms-transform': 'translate3D(0px, 0px, 0px)',
        '-webkit-transform': 'translate3D(0px, 0px, 0px)',
        '-moz-transform': 'translate3D(0px, 0px, 0px)',
        '-o-transform': 'translate3D(0px, 0px, 0px)',
        transform: 'translate3D(0px, 0px, 0px)',
        opacity: 1})),
      transition('void => *', [
        style({opacity: 0,
          '-ms-transform': 'translate3D(0px, 150px, 0px)',
          '-webkit-transform': 'translate3D(0px, 150px, 0px)',
          '-moz-transform': 'translate3D(0px, 150px, 0px)',
          '-o-transform': 'translate3D(0px, 150px, 0px)',
          transform: 'translate3D(0px, 150px, 0px)',
        }),
        animate('0.3s 0.25s ease-out')
      ])
    ])
  ]
})

export class LoginComponent implements OnInit {
  public formData: any;
  public questions: any;
  public companies: any;
  public subCompanies: any;
  public formCompany: any;
  public formSubCompany: any;
  public myFormCompany: FormGroup;
  public myFormSubCompany: FormGroup;
  public pass: any;
  public formDataForget: any;
  public progress: boolean = false;
  public error: string = '';
  public showForgetForm :boolean = false;
  public showRegisterForm :boolean = false;
  public showChangePassForm :boolean = false;
  @Output() getLoggedInName: EventEmitter<any> = new EventEmitter();
  public data_sponsor: FormControl;
  public data_platinum: FormControl;
  public usersAll:Array<any> = [];
  public row: any;
  public ita: string;
  public myFormSponsor: FormGroup;
  public myFormPlatinum: FormGroup;
  public usersLocal: Array<any> = [];
  public placeholderSponsor: string;
  public placeholderPlatinum: string;
  public userNotExist:boolean = false;
  public customData: CustomData;
  @ViewChild("remoteDataSponsor") private remoteDataSponsor: CompleterCmp;
  @ViewChild("remoteDataPlatinum") private remoteDataPlatinum: CompleterCmp;
  public disabledSubCompany: boolean = false;
  public dataCompany: FormControl;
  public dataSubCompany: FormControl;

  constructor(private http: Http, private completerService: CompleterService, private builder: FormBuilder, private _sanitizer: DomSanitizer, public userService:UserService, public activatedRoute: ActivatedRoute, public app: AppComponent, private navbarTitleService: NavbarTitleService, public router: Router, public authGuard: AuthGuard, public authService: AuthService,  public location: Location,  private notificationService: NotificationService) {
    //this.forget = this.router.get('id');
    this.customData = new CustomData(userService, http);
    
   }

  public ngOnInit() {
          //this.authService.setName('');
          //this.authService.logout();
          //this.isLoggedIn();
          this.navbarTitleService.updateTitle('Login');
          if(this.authService.authenticated())
            this.router.navigate(['/dashboard']);
            
          this.formData = {
            address:""
          };

          this.formDataForget = {
          };
          this.placeholderSponsor = "Por favor espere...";
          this.placeholderPlatinum = "Por favor espere...";
          this.placeholderSponsor = "Nombre del patriconador o ITA...";
          this.placeholderPlatinum = "Nombre del platino directo o ITA...";
          this.disabledSubCompany = true;
          
          this.getQuestions();


          //this.showCompletForm = true;           
  }

    public register(){
      
      this.showRegisterForm = true;
      this.myFormSponsor = this.builder.group({
        sponsor : "",
      });
      this.myFormPlatinum = this.builder.group({
        platinum : "",
      });

    this.myFormPlatinum = this.builder.group({
      platinum: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.myFormSponsor = this.builder.group({
      sponsor: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.formData = {};
  
    //this.myFormPlatinum.disable();
    //this.myFormSponsor.disable();
    this.placeholderSponsor = "Patrocinador";
    this.placeholderPlatinum = "Platino directo";
    this.placeholderSponsor = "Nombre del patriconador o ITA...";
    this.placeholderPlatinum = "Nombre del platino directo o ITA...";
    this.formData.id_question = 1;

    this.formCompany = { };
    this.formSubCompany= { };
    this.myFormCompany = this.builder.group({
      company : ['0', [Validators.required, Validators.minLength(3)]],
    });

    this.myFormSubCompany = this.builder.group({
      sub_company :  ['0', [Validators.required, Validators.minLength(3)]],
    });

    this.getCompanies();

    this.formData.id_company = 0;
    this.formData.id_sub_company = 0;

    }

    public getUserEmail(){
    this.progress=true;
    
    //console.log('Submitting values', this.formData);
     this.userService.getUserEmail(this.formData.email).subscribe(
        (response) => this.onSuccessUserEmail(response.json()), 
        (error) => this.onErrorUserEmail(error.json()), 
        () => this.onCompleteUserEmail()
      );
  }

    onSuccessUserEmail(response){
    //this.showNotification('top', 'center', '<b>'+response.message+'</b>', 'pe-7s-check', 2);
    this.userNotExist = false;
    console.log(response);
    if(response.email ==null || response.id_question ==null || response.email =='' || response.id_question =='')
      {
        this.showRegisterForm = true;
        this.formData = response;
        this.formData.password = '';
      }else{  
        this.showRegisterForm = false;
        this.formData = {};
        this.formData.email = this.formData.email;
        this.showNotification('top', 'center', '<b>Ya está registrado. Por favor inicie sesión.</b>', 'pe-7s-check', 2);
      }
  }

    onErrorUserEmail(error){
    this.progress = false;
    this.userNotExist = true;
    //this.getUsers('');    
    /*this.showRegisterForm = false;
    this.formData = {};
    this.showNotification('top', 'center', '<b>'+error.message+' Por favor comuniquese con su platino directo o patrocinante...</b>', 'pe-7s-attention', 4);
    //this.router.navigate(['/login']);*/
    //console.log(error.message);  
  }
  
  onCompleteUserEmail(){
    this.progress = false;
    this.myFormSponsor = this.builder.group({
        sponsor : "",
      });
      this.myFormPlatinum = this.builder.group({
        platinum : "",
      });
    this.myFormPlatinum = this.builder.group({
      platinum: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.myFormSponsor = this.builder.group({
      sponsor: ['', [Validators.required, Validators.minLength(3)]],
    });
      
      //if(this.showRegisterForm)
      //this.getUsers('');      

    }

    public getUserIta2(){
      //this.ita = this.formData.ita;
      this.myFormSponsor = this.builder.group({
        sponsor : "",
      });
      this.myFormPlatinum = this.builder.group({
        platinum : "",
      });
      
    this.myFormPlatinum = this.builder.group({
      platinum: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.myFormSponsor = this.builder.group({
      sponsor: ['', [Validators.required, Validators.minLength(3)]],
    });
      //this.getUsers('');      
    }

    public getNameUser(ita){
    let name = '';
    this.usersAll.filter(i => i.ita == ita ).forEach(element => {
      //console.log(element.name);
       name = element.name + ' '+ element.last;
    });
    return name;
  }

     autocompleListFormatter = (data: any) : SafeHtml => {
    let html = `<span>${data.name} ${data.last}</span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

    public forgetPass() {
    this.progress = true;
    this.userService.forgetPass(this.formDataForget).subscribe(
        (response) => this.onSuccessForget(response.json()), 
        (error) => this.onErrorForget(error.json()), 
        () => this.onCompleteForget()
      );
   
    //console.log (val);
    //this.authService.login_2(this.formData);
  }
  
  onSuccessForget(response){
  this.showNotification('top', 'center', '<b>'+response.message+'</b>', 'pe-7s-check', 2);
  //console.log(response);
  
  }
  
  onErrorForget(error){
  this.progress = false;
  this.showNotification('top', 'center', '<b>'+error.message+'</b>', 'pe-7s-attention', 4);
  //console.log(error);  
  }

  onCompleteForget(){
  //this.pService.done();
  this.progress = false;
  this.showForgetForm = false;
  //console.log('ok');
  //this.app.ngOnInit();
  this.router.navigate(['/login']);
  }

  public onSubmit() {
    this.progress = true;
    this.authService.login(this.formData).subscribe(
        (response) => this.onSuccessLogin(response.json()), 
        (error) => this.onErrorLogin(error.json()), 
        () => this.onCompleteLogin()
      );
   
    //console.log (val);
    //this.authService.login_2(this.formData);
    }
    onSuccessLogin(response){
      
    if(response.email==null || response.id_question ==null || response.email=='' || response.id_question =='')
    {
      this.showRegisterForm = true;  
      //this.formData = response;
      this.register();
      this.getSubCompanies(response.id_sub_company);
      //this.getUserIta();
      this.showNotification('top', 'center', 'Debe completar los datos del<b> registro </b>para poder entrar', 'pe-7s-attention', 3);
      this.formData.email = response.email;
      this.getUserEmail();
      //this.getUsers();

    }else{
      this.showRegisterForm = false;  
      //localStorage.setItem('ita', response.ita);
      localStorage.setItem('id_user', response.id_user);
      localStorage.setItem('email', response.email);
      localStorage.setItem('name', response.name);
      localStorage.setItem('last', response.last);
      localStorage.setItem('id_rol', response.id_rol);
      //localStorage.setItem('id_position', response.id_position);
      localStorage.setItem('user', JSON.stringify(response));
      this.authService.setLoggedIn(true);

    if(response.id_rol == '1') 
        this.userService.setIsAdmin(true) 
      else 
        this.userService.setIsAdmin(false) 

    if(response.id_rol == '2') 
        this.userService.setIsAuth(true) 
      else 
        this.userService.setIsAuth(false) 
    
    if(response.id_rol == '3') 
        this.userService.setIsPublish(true) 
      else 
        this.userService.setIsPublish(false) 

    if(response.id_rol == '4') {
      this.userService.setIsUser(true);
      //this.showNotification('top', 'center', '<b>Usted no tiene acceso al dashboard</b>', 'pe-7s-attention', 4);
      //this.authService.logout();
    }else{ 
        this.userService.setIsUser(false) 
    }
    this.authService.setName(response.name + ' ' + response.last);
    
  }
    this.progress = false;

    //console.log(response);
    
  }

    onErrorLogin(error){
    //this.pService.done();
    this.progress = false;
    this.authService.setLoggedIn(false);
    if(error.message)
    this.showNotification('top', 'center', '<b>'+error.message+'</b>', 'pe-7s-attention', 4);
    else
    this.showNotification('top', 'center', '<b>Error al comunicar con el servidor</b>', 'pe-7s-attention', 4);
    //this.authService.logout();
  }
  
  onCompleteLogin(){
    //this.pService.done();
    this.progress = false;
    if(this.showRegisterForm){
      //this.getUsers();
      this.showRegisterForm = true;
    }
    else{
    //console.log('ok');
    //this.app.ngOnInit();
      var name = localStorage.getItem('name') + ' ' + localStorage.getItem('last');
      setTimeout(()=>{
      this.showNotification('top', 'center', 'Hola <b>' + name  + '</b>. Bienvenido al <b>Dashboard de ' + vars.app + '</b>.', 'pe-7s-gift', 1);
      }, 1500);

      this.router.navigate(['/dashboard']);
    }
  }

  public onSubmitEditUser(){
    this.progress=true;
    console.log('Submitting values', this.formData);
    if(!this.userNotExist){
      //actualiza usuario
     this.userService.updateUserAppBack(this.formData, this.formData.sponsor, this.formData.platinum).subscribe(
        (response) => this.onSuccess(response.json()), 
        (error) => this.onError(error.json()), 
        () => this.onComplete()
      );
    }else{
      //nuevo usuario
      //this.formData.id_rol = 4;
      //this.formData.id_position = 6;
      console.log('Submitting values', this.formData);
      this.userService.newUserApp(this.formData, this.formData.sponsor, this.formData.platinum).subscribe(
        (response) => this.onSuccess(response.json()), 
        (error) => this.onError(error.json()), 
        () => this.onComplete()
      );
    }
  }

    onSuccess(response){
    this.showNotification('top', 'center', '<b>'+response.message+'</b>', 'pe-7s-check', 2);
    //console.log(response);
  }

    onError(error){
    this.progress = false;
    //this.showRegisterForm = false;
    this.showNotification('top', 'center', '<b>'+error.message+'</b>', 'pe-7s-attention', 4);
    //console.log(error.message);  
  }
  
  onComplete(){
    this.showRegisterForm = false;
    this.progress = false;
    this.formData = {};
    this.router.navigate(['/login']);
    }

    public onSponsorSelected(selected: CompleterItem) {
      if (selected) {
        //console.log(selected.originalObject);
          this.formData.sponsor = {
            "ita": selected.originalObject.ita,
            "name": selected.originalObject.name + ' ' + selected.originalObject.last
          };
          this.remoteDataSponsor.blur();
          this.remoteDataPlatinum.focus();
      } else {
          this.formData.sponsor = {};
      }
      //console.log(this.formData);
    }

    public onPlatinumSelected(selected: CompleterItem) {
      if (selected) {
        //console.log(selected.originalObject);
          this.formData.platinum = {
            "ita": selected.originalObject.ita,
            "name": selected.originalObject.name + ' ' + selected.originalObject.last
          };
          this.remoteDataPlatinum.blur();
      } else {
          this.formData.platinum = {};
      }
      //console.log(this.formData);
    }

    public getUsers(element){
    //this.progress = true;
    //this.myFormSponsor.disable();
    //this.myFormPlatinum.disable();
    this.placeholderSponsor = "Por favor espere...";
    this.placeholderPlatinum = "Por favor espere...";
    this.placeholderSponsor = "Nombre del patriconador o ITA...";
    this.placeholderPlatinum = "Nombre del platino directo o ITA...";
    
    //console.log(this.rols);
    
    this.userService.getUsers(element.value).subscribe(
        (response) => { this.onSuccessUsers (response) },
        (error) => { 
          this.showNotification('top', 'center', '<b>'+error.json().message+'</b>', 'pe-7s-attention', 4); 
          console.log(error.json()); 
          this.progress=false; 
        }, 
        //() => this.onCompleteLogin()
    );
  }


  public onSuccessUsers(response){
  //console.log(response.json())
  this.progress = false;
  //this.myFormPlatinum.enable();
  //this.myFormSponsor.enable();
  //this.placeholderSponsor = "Nombre del patriconador o ITA...";
  //this.placeholderPlatinum = "Nombre del platino directo o ITA...";
  this.usersAll = response.json();
  this.data_sponsor = response.json();
  this.data_platinum = response.json().filter(i => i.id_position < '4') ;
  //this.formData = response.json().filter(i => i.ita == this.formData.ita)[0] ;
  localStorage.setItem('users', JSON.stringify(response.json()));
  //console.log
  
  //console.log(row['sponsor']);
  /*
  this.formData.sponsor = {
        "ita": this.formData.ita_sponsor,
        "name": this.getNameUser(this.formData.ita_sponsor)
      };
  this.formData.platinum = {
        "ita": this.formData.ita_platinum,
        "name": this.getNameUser(this.formData.ita_platinum)
      };
      */
     
  }


    public getQuestions() {
    //this.progress = true;
    this.userService.getQuestions().subscribe(
        (response) => this.questions = (response.json()), 
        (error) => { 
          if(error.message)
          this.showNotification('top', 'center', '<b>'+error.message+'</b>', 'pe-7s-attention', 4);
          else
          this.showNotification('top', 'center', '<b>Error al comunicar con el servidor</b>', 'pe-7s-attention', 4);
         }
       //() => this.onCompleteForget()
      );
   
    //console.log (val);
    //this.authService.login_2(this.formData);
  }


  public getCompanies() {
    //this.progress = true;
    this.userService.getCompanies().subscribe(
      (response) => this.dataCompany = response.json(), 
      (error) => console.log(error.json()), 
      //() => this.onCompleteLogin()
  );
    //console.log (val);
    //this.authService.login_2(this.formData);
  }


  public getSubCompanies(id_company){
    //console.log(id_category);
     this.disabledSubCompany = true;
      this.formCompany.id_sub_company=1;
      this.userService.getSubCompanies(0).subscribe(
       (response) => {
         this.dataSubCompany = response.json().filter(i => i.id_company == id_company); 
         this.formCompany.id_sub_company=0;
         this.disabledSubCompany = false;
       }, 
       (error) => console.log(error.json()), 
       //() => this.onCompleteLogin()
   );
 }

    //if(!val)
     // this.showNotification('top', 'center', vars.apiError, 'pe-7s-attention', 3);
    //window.location.hash = '';
    //this.router.navigate(['/']);
    //console.log('Submitting values', this.formData);

  public forgetPass2() {
    this.progress = true;
    this.userService.forgetPass2(this.formDataForget).subscribe(
        (response) => this.onSuccessForget2(response.json()), 
        (error) => this.onErrorForget2(error.json()), 
        () => this.onCompleteForget2()
      );
   
    //console.log (val);
    //this.authService.login_2(this.formData);
  }
  
  onSuccessForget2(response){
  
  localStorage.setItem('email', response.user.email);
  //this.showNotification('top', 'center', '<b>'+response.message+'</b>', 'pe-7s-check', 2);
  //console.log(response);
  
  }
  
  onErrorForget2(error){
  this.progress = false;
  this.showNotification('top', 'center', '<b>'+error.message+'</b>', 'pe-7s-attention', 4);
  //console.log(error);  
  }

  onCompleteForget2(){
  //this.pService.done();
  this.progress = false;
  this.showForgetForm = false;
  //console.log('ok');
  //this.app.ngOnInit();
  this.router.navigate(['/change-pass']);
  }

  public showNotification(from: string, align: string, message: string, icon: string, type: number) {
    //const type = Math.floor((Math.random() * 4) + 1);
    //console.log (type);
    this.notificationService.notify(new NotificationOptions({
      message: message,
      icon: icon,
      type: <NotificationType>(type),
      from: from,
      align: align
    }));
  }

}

@Component({
  selector: 'app-user',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('carduserprofile', [
      state('*', style({
        '-ms-transform': 'translate3D(0px, 0px, 0px)',
        '-webkit-transform': 'translate3D(0px, 0px, 0px)',
        '-moz-transform': 'translate3D(0px, 0px, 0px)',
        '-o-transform': 'translate3D(0px, 0px, 0px)',
        transform: 'translate3D(0px, 0px, 0px)',
        opacity: 1
      })),
      transition('void => *', [
        style({opacity: 0,
          '-ms-transform': 'translate3D(0px, 150px, 0px)',
          '-webkit-transform': 'translate3D(0px, 150px, 0px)',
          '-moz-transform': 'translate3D(0px, 150px, 0px)',
          '-o-transform': 'translate3D(0px, 150px, 0px)',
          transform: 'translate3D(0px, 150px, 0px)',
        }),
        animate('0.3s 0s ease-out'),
      ])
    ]),
    trigger('cardprofile', [
      state('*', style({
        '-ms-transform': 'translate3D(0px, 0px, 0px)',
        '-webkit-transform': 'translate3D(0px, 0px, 0px)',
        '-moz-transform': 'translate3D(0px, 0px, 0px)',
        '-o-transform': 'translate3D(0px, 0px, 0px)',
        transform: 'translate3D(0px, 0px, 0px)',
        opacity: 1})),
      transition('void => *', [
        style({opacity: 0,
          '-ms-transform': 'translate3D(0px, 150px, 0px)',
          '-webkit-transform': 'translate3D(0px, 150px, 0px)',
          '-moz-transform': 'translate3D(0px, 150px, 0px)',
          '-o-transform': 'translate3D(0px, 150px, 0px)',
          transform: 'translate3D(0px, 150px, 0px)',
        }),
        animate('0.3s 0.25s ease-out')
      ])
    ])
  ]
})
export class LogoutComponent implements OnInit {

  public formData: any;

  constructor(private route:ActivatedRoute, private app: AppComponent, private navbarTitleService: NavbarTitleService, public router: Router, public authGuard: AuthGuard, public authService: AuthService) { 
    console.log(route.snapshot.url[0].path);
  }

  public ngOnInit() {
    
    //console.log(localStorage.getItem('name'));
    if(this.route.snapshot.url[0].path === 'logout'){
    this.authService.logout();
    this.authService.setName('');
    //this.app.ngOnInit();
    
    this.formData = {
      ita: '',
      password: '',
    };



  }

  }



}
