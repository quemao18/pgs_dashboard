import { Component, OnInit, ViewChild, trigger, state, style, transition, animate, } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Location } from '@angular/common';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { NavbarTitleService } from '../lbd/services/navbar-title.service';
import { Router } from '@angular/router';
import { NotificationService, NotificationType, NotificationOptions } from '../lbd/services/notification.service';

import { CompleterCmp, CompleterItem, CompleterService, CompleterData, RemoteData } from 'ng2-completer';
import { Observable } from "rxjs/Observable";
import { Http, Headers, URLSearchParams, RequestOptions, Jsonp } from '@angular/http';
import { CustomData } from "../services/custom-data";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [
    trigger('cardtable1', [
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
        animate('0.3s 0s ease-out')
      ])
    ]),
    trigger('cardtable2', [
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
    ]),
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
export class ProfileComponent implements OnInit {

  public progress: boolean;

  public usersAll:Array<any> = [];
  public formData: any;
  public sponsor: any;
  public platinum: any;

  public questions: any;
  public data_sponsor: FormControl;
  public data_platinum: FormControl;
  
  public myFormSponsor: FormGroup;
  public myFormPlatinum: FormGroup;

  public imageIsUpload: boolean = false;
  public avatar_url: string = '';
  public newPic : boolean = false;
  public _event : Event;

  public customData: CustomData;
  @ViewChild("remoteDataSponsor") private remoteDataSponsor: CompleterCmp;
  @ViewChild("remoteDataPlatinum") private remoteDataPlatinum: CompleterCmp;
  public name: string;
  public placeholderSponsor: string;
  public placeholderPlatinum: string;

  constructor(private http: Http, private completerService: CompleterService, public authService: AuthService, public location: Location, private builder: FormBuilder, private _sanitizer: DomSanitizer, private userService: UserService, private navbarTitleService: NavbarTitleService, private notificationService: NotificationService, private router: Router) {
    this.customData = new CustomData(userService, http); 
   }


  ngOnInit() {
  
    this.navbarTitleService.updateTitle('Perfil Usuario');
    
    this.formData = {
      ita: "",
      sponsor : {},
      platinum: {}
    };
    
    this.myFormSponsor = this.builder.group({
      sponsor : {},
    });
    this.myFormPlatinum = this.builder.group({
      platinum : {},
    });

    this.myFormPlatinum = this.builder.group({
      platinum: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.myFormSponsor = this.builder.group({
      sponsor: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.avatar_url = '';
    this.imageIsUpload = true;
    this.loadUser(JSON.parse(localStorage.getItem('user')));

    this.getQuestions();
    this.placeholderSponsor = "Nombre del patriconador o ITA...";
    this.placeholderPlatinum = "Nombre del platino directo o ITA...";
   
  }


    public getQuestions() {
    //this.progress = true;
    this.userService.getQuestions().subscribe(
        (response) => this.questions = (response.json()), 
        (error) => console.log(error.json())
       //() => this.onCompleteForget()
      );
  }

  public loadUser(user){
    this.formData = user;
    this.formData.sponsor = {
      "ita": this.formData.ita_sponsor,
      "name": ''
    }
    this.formData.platinum = {
      "ita": this.formData.ita_platinum,
      "name": ''
    }
    console.log(user);
    this.sponsor = user.name_sponsor;
    this.platinum = user.name_platinum;    

    
    this.formData.password = '';
    this.avatar_url = user.photo;

  }

  autocompleListFormatter = (data: any) : SafeHtml => {
    let html = `<span>${data.name} ${data.last}</span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
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


  public getUsers(q){
    this.progress = true;
    //console.log(this.rols);
    this.userService.getUsers(q).subscribe(
        (response) => this.onSuccessUsers (response),
        (error) => { 
          this.showNotification('top', 'center', '<b>'+error.json().message+'</b>', 'pe-7s-attention', 4); 
          console.log(error.json()); 
          this.progress=false; 
        }, 
        //() => this.onCompleteLogin()
    );
  }


  public onSuccessUsers(response){
      //this.progress = false;
      this.myFormPlatinum.enable();
      this.myFormSponsor.enable();
      this.usersAll = response.json();
      this.data_sponsor = response.json();
      this.data_platinum = response.json().filter(i => i.id_position < '6') ;

      //setTimeout( () => this.usersAll = response.json(), 10000);
  }


  public getNameUser(ita){
    let name = '';
    this.usersAll.filter(i => i.ita == ita ).forEach(element => {
      //console.log(element.name);
       name = element.name + ' '+ element.last;
    });
    return name;
  }


  public getNameUserSponsor(ita){
    let name = '';
    this.usersAll.filter(i => i.ita_sponsor == ita ).forEach(element => {
      //console.log(element.name);
       name = element.name + ' '+ element.last;
    });
    return name;
  }


    public onSubmitEditUser(){
    this.progress=true;
   
    if(this.newPic || this.avatar_url!='')
      this.formData.avatar_url = this.avatar_url;

    //console.log('Submitting values', this.formData);
     this.userService.updateUserAppBack(this.formData, this.formData.sponsor, this.formData.platinum).subscribe(
        (response) => this.onSuccessUpdate(response.json()), 
        (error) => this.onErrorUpdate(error.json()), 
        () => this.onCompleteUpdate()
      );
  }

    onSuccessUpdate(response){

    //this.showNotification('top', 'center', '<b>'+response.message+'</b>', 'pe-7s-check', 2);
     // this.showNotification('top', 'center', '<b>Vuelva a iniciar seisión para cargar sus datos...</b>', 'pe-7s-check', 2);
    //console.log(response);
  }

    onErrorUpdate(error){
    this.progress = false;
    //this.showRegisterForm = false;
    this.showNotification('top', 'center', '<b>'+error.message+'</b>', 'pe-7s-attention', 4);
    //console.log(error.message);  
  }
  
  onCompleteUpdate(){
    //localStorage.setItem('user', JSON.stringify(this.formData));
    this.progress = false;
    this.formData = {};
    //this.authService.logout();
    this.router.navigate(['/logout']);
    setTimeout( ()=> { location.reload() }, 1000 );
    //this.router.navigate(['/dashboard']);
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

  public image($event){
    this.newPic = true;
    this.imageIsUpload = false;
  }

  public uploadImage($event) {
    this.newPic = true;
    this.imageIsUpload = false;
    //console.log($event);
    this.userService.fileChange($event).subscribe(
        (response) => this.onSuccessUpload(response.json()), 
        (error) => console.log(error.json()), 
        () => this.onCompleteUpload()
    )
  }

  onSuccessUpload(response){
    console.log(response);
    if(!response.status)
      {
        this.imageIsUpload = false;
        this.showNotification('top', 'center', '<b>'+response.message+'</b>', 'pe-7s-attention', 4);
      }else{
        this.imageIsUpload = true;
        this.formData.photo = response.avatar_url;
        this.avatar_url = response.avatar_url;
      }
    
  }

  onCompleteUpload(){
    this.progress = false;
    console.log('ok');

    //this.formData.id_event = 0;

   }

  public imageRemoved($event){
    this.imageIsUpload = false;
    this.avatar_url = '';
  }


}
