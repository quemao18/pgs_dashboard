import { Component, OnInit, ViewChild, trigger, state, style, transition, animate, } from '@angular/core';
import { UserService } from '../services/user.service';
import { Location } from '@angular/common';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { NavbarTitleService } from '../lbd/services/navbar-title.service';
import { Router } from '@angular/router';
import { NotificationService, NotificationType, NotificationOptions } from '../lbd/services/notification.service';

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
  public questions: any;
  public data_sponsor: FormControl;
  public data_platinum: FormControl;
  
  public myFormSponsor: FormGroup;
  public myFormPlatinum: FormGroup;

  constructor(public location: Location, private builder: FormBuilder, private _sanitizer: DomSanitizer, private userService: UserService, private navbarTitleService: NavbarTitleService, private notificationService: NotificationService, private router: Router) { }


  ngOnInit() {
  
    this.navbarTitleService.updateTitle('Perfil Usuario');
    
    this.formData = {
      sponsor : {},
      platinum: {}
    };
    this.getQuestions();

    this.getUsers();
    
    this.myFormSponsor = this.builder.group({
      sponsor : {},
    });
    this.myFormPlatinum = this.builder.group({
      platinum : {},
    });

    this.loadUser(JSON.parse(localStorage.getItem('user')));

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
      "name": this.getNameUser(this.formData.ita_sponsor)
    }
    this.formData.platinum = {
      "ita": this.formData.ita_platinum,
      "name": this.getNameUser(this.formData.ita_platinum)
    }
    

  }

  autocompleListFormatter = (data: any) : SafeHtml => {
    let html = `<span>${data.name} ${data.last}</span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }


  public getUsers(){

    this.progress = true;
    //console.log(this.rols);
    this.userService.getUsers().subscribe(
        (response) => this.onSuccessUsers (response),
        (error) => console.log(error.json()), 
        //() => this.onCompleteLogin()
    );


  }


  public onSuccessUsers(response){
      this.progress = false;
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


    public onSubmitEditUser(){
    this.progress=true;
    //console.log('Submitting values', this.formData);
     this.userService.updateUserApp(this.formData, this.formData.sponsor, this.formData.platinum).subscribe(
        (response) => this.onSuccessUpdate(response.json()), 
        (error) => this.onErrorUpdate(error.json()), 
        () => this.onCompleteUpdate()
      );
  }

    onSuccessUpdate(response){
    this.showNotification('top', 'center', '<b>'+response.message+'</b>', 'pe-7s-check', 2);
    //console.log(response);
  }

    onErrorUpdate(error){
    this.progress = false;
    //this.showRegisterForm = false;
    this.showNotification('top', 'center', '<b>'+error.message+'</b>', 'pe-7s-attention', 4);
    //console.log(error.message);  
  }
  
  onCompleteUpdate(){
    this.progress = false;
    this.formData = {};
    this.router.navigate(['/dashboard']);
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
