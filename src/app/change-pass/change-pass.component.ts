import {Component, OnInit, trigger, state, style, transition, animate, Output, EventEmitter} from '@angular/core';
import { Location } from '@angular/common';
import { NavbarTitleService } from '../lbd/services/navbar-title.service';
import {  Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { AuthGuard } from '../services/auth-guard.service';
import { NotificationService, NotificationType, NotificationOptions } from '../lbd/services/notification.service';
import * as vars from '../config';

@Component({
  selector: 'app-user',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.scss'],
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

export class ChangePassComponent implements OnInit {
  public formDataChange: any;
  public pass: any;
  public formDataForget: any;
  public progress: boolean = false;
  public error: string = '';
  public showForgetForm :boolean = false;
  public showChangePassForm :boolean = false;
  @Output() getLoggedInName: EventEmitter<any> = new EventEmitter();

  constructor(public userService: UserService, public activatedRoute: ActivatedRoute, private navbarTitleService: NavbarTitleService, public router: Router, public authGuard: AuthGuard, public authService: AuthService,  public location: Location,  private notificationService: NotificationService) {
    //this.forget = this.router.get('id');
   }

  public ngOnInit() {

          //this.isLoggedIn();
          this.navbarTitleService.updateTitle('Cambiar Password');
          console.log(localStorage);
          this.formDataChange = {
            ita: localStorage.getItem('ita'),
            password: '',
            password_conf: '',
          };
          

  }


 public changePass() {
   //if(this.formDataChange.password != this.formDataChange.password_conf )
   //this.showNotification('top', 'center', '<b>Los passwords no son iguales</b>', 'pe-7s-attention', 4);
    //console.log(this.formDataChange);
    this.progress = true;
    this.userService.changePass(this.formDataChange).subscribe(
        (response) => this.onSuccessChange(response.json()), 
        (error) => this.onErrorChange(error.json()), 
        () => this.onCompleteChange()
      );
   
    //console.log (val);
    //this.authService.login_2(this.formData);
  }
  
  onSuccessChange(response){
  this.showNotification('top', 'center', '<b>'+response.message+'</b>', 'pe-7s-check', 2);
  console.log(response);
  
  }
  
  onErrorChange(error){
  this.progress = false;
  this.showNotification('top', 'center', '<b>'+error.message+'</b>', 'pe-7s-attention', 4);
  console.log(error);  
  }

  onCompleteChange(){
  //this.pService.done();
  this.progress = false;
  this.showForgetForm = false;
  this.authService.logout();
  //this.router.navigate(['/login']);
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
