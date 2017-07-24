import { Component, OnInit, trigger, state, style, transition, animate, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { NavbarTitleService } from '../lbd/services/navbar-title.service';
import {  Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../services/auth-guard.service';
import { UserService } from '../services/user.service';
import { NotificationService, NotificationType, NotificationOptions } from '../lbd/services/notification.service';
import * as vars from '../config';
import { AppComponent } from '../app.component';

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
  public pass: any;
  public formDataForget: any;
  public progress: boolean = false;
  public error: string = '';
  public showForgetForm :boolean = false;
  public showChangePassForm :boolean = false;
  @Output() getLoggedInName: EventEmitter<any> = new EventEmitter();

  constructor(public userService:UserService, public activatedRoute: ActivatedRoute, public app: AppComponent, private navbarTitleService: NavbarTitleService, public router: Router, public authGuard: AuthGuard, public authService: AuthService,  public location: Location,  private notificationService: NotificationService) {
    //this.forget = this.router.get('id');
   }

  public ngOnInit() {


          //this.authService.setName('');
          this.authService.logout();
          //this.isLoggedIn();
          this.navbarTitleService.updateTitle('Login');
          if(this.authService.authenticated())
            this.router.navigate(['/dashboard']);
            
          this.formData = {
            username: '',
            password: '',
          };

          this.formDataForget = {
            ita: '',
            email: '',
            id_question: '',
            answer: ''
          };

          this.getQuestions();
          
    
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
  console.log(response);
  
  }
  
  onErrorForget(error){
  this.progress = false;
  this.showNotification('top', 'center', '<b>'+error.message+'</b>', 'pe-7s-attention', 4);
  console.log(error);  
  }

  onCompleteForget(){
  //this.pService.done();
  this.progress = false;
  this.showForgetForm = false;
  console.log('ok');
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
      
    localStorage.setItem('ita', response.ita);
    localStorage.setItem('name', response.name);
    localStorage.setItem('last', response.last);
    localStorage.setItem('id_rol', response.id_rol);
    localStorage.setItem('id_position', response.id_position);
    
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
      this.showNotification('top', 'center', '<b>Usted no tiene acceso al dashboard</b>', 'pe-7s-attention', 4);
      this.authService.logout();
    }else 
        this.userService.setIsUser(false) 
    
    this.authService.setName(response.name + ' ' + response.last);

    this.progress = false;
    //console.log(response);
    
  }

    onErrorLogin(error){
    //this.pService.done();
    this.progress = false;
    this.authService.setLoggedIn(false);
    //console.log(error.message);
    this.showNotification('top', 'center', '<b>'+vars.apiError+'</b>', 'pe-7s-attention', 4);
    this.authService.logout();
  }
  
  onCompleteLogin(){
    //this.pService.done();
    this.progress = false;
    //console.log('ok');
    //this.app.ngOnInit();
    this.router.navigate(['/dashboard']);
  }
  
   

    public getQuestions() {
    //this.progress = true;
    this.userService.getQuestions().subscribe(
        (response) => this.questions = (response.json()), 
        (error) => console.log(error.json())
       //() => this.onCompleteForget()
      );
   
    //console.log (val);
    //this.authService.login_2(this.formData);
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
  
  localStorage.setItem('ita', response.user.ita);
  //this.showNotification('top', 'center', '<b>'+response.message+'</b>', 'pe-7s-check', 2);
  console.log(response);
  
  }
  
  onErrorForget2(error){
  this.progress = false;
  this.showNotification('top', 'center', '<b>'+error.message+'</b>', 'pe-7s-attention', 4);
  console.log(error);  
  }

  onCompleteForget2(){
  //this.pService.done();
  this.progress = false;
  this.showForgetForm = false;
  console.log('ok');
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

  constructor(private app: AppComponent, private navbarTitleService: NavbarTitleService, public router: Router, public authGuard: AuthGuard, public authService: AuthService) { }

  public ngOnInit() {
    
    //console.log(localStorage.getItem('name'));
    
    this.authService.logout();
    this.authService.setName('');
    //this.app.ngOnInit();
    //location.reload();
    //this.router.navigate(['/']);
    
    this.formData = {
      username: '',
      password: '',
    };

  }

}
