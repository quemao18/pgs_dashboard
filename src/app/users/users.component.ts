import { Component, OnInit, ViewChild, trigger, state, style, transition, animate } from '@angular/core';
import { NavbarTitleService } from '../lbd/services/navbar-title.service';
import { TableData } from '../lbd/lbd-table/lbd-table.component';
import { Router } from '@angular/router';
import { NotificationService, NotificationType, NotificationOptions } from '../lbd/services/notification.service';
import * as vars from '../config';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
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
export class UsersComponent implements OnInit {
  
  public tableData: any;
  public users: Array<any> = [];
  public usersAll: any;
  public usersArray = new Array();
  public allUsers = new Array();
  public formData: any;
  public positions: any;
  public row: any;
  public notify: any;
  public rols: any;
  public title: string = 'Agregar';
  public titleModal: string = 'Perfil';
  public titleModalEdit: string = 'Editar Usuario';
  public iconActiveUser: string = 'pe-7s-power';
  //public page: number = 1;
  public pagination: number = vars.pagination;
  public showEditForm : boolean = false;
  public showCardUser : boolean = false;
  public showNewForm : boolean = false;

  public progress: boolean = false;
  public status: number = 0;

  public page:number = 1;
  
  public args: any = [];

  private data:Array<any> = [];

  @ViewChild('modalEdit')
  modalEdit: ModalComponent;
  @ViewChild('modal')
  modal: ModalComponent;

  constructor(private userService: UserService, private navbarTitleService: NavbarTitleService, private notificationService: NotificationService, private router: Router) {

   }

  public ngOnInit() {
    
    this.navbarTitleService.updateTitle('Usuarios');
    if(!this.userService.isAdmin() && !this.userService.isAuth() )
        this.router.navigate(['/dashboard']);

    //this.notify = {show: false, message: ''};
    this.tableData = {
    headerRow: ['ITA', 'Nombre', 'Apellido', 'Posición Ejecutíva', 'ROL' , 'ACCIONES'],
  };

    this.data = [];
    this.formData = {
      ita: '',
      email: '',
      name: '',
      last: '',
      address: '',
      id_position: '',
      id_rol: '',
      status:''
    };

    this.showCardUser = this.showEditForm = this.showNewForm = this.progress = false;
    this.getRols();    
    this.getPositions();
    this.getUsers();
  }

  public filterValues(val){
      console.log(val);
      this.args = {
        name: val
      }
      
  }


  public showRow(row, rowValues){
  
    return rowValues;
  }

    public newUser(){
    this.showNewForm = true;
    this.showEditForm = false;
    this.showCardUser = false;

    this.formData ={};
    this.formData = {
      ita: '',
      email: '',
      name: '',
      last: '',
      address: '',
      id_position: '',
      phone:'',
      id_rol: '',
      status:'',
      password:''
    };

  }


  public editUser(row){
    this.showEditForm = true;
    this.showCardUser = false;
    this.formData = row;
  }

  public showUser(row){
    this.formData = row;
    console.log();
    this.modal.open();
  }

  public onSubmitNewUser(){
    this.progress=true;
    console.log('Submitting values', this.formData);
     this.userService.newUser(this.formData).subscribe(
        (response) => this.onSuccessNewUser(response.json()), 
        (error) => this.onErrorNewUser(error.json()), 
        () => this.onCompleteNewUser()
      );
  }

   onSuccessNewUser(response){
    this.showNotification('top', 'center', '<b>'+response.message+'</b>', 'pe-7s-check', 2);
    console.log(response);
    
  }

  onErrorNewUser(error){
    this.progress = false;
    this.showNewForm = true;
    this.showEditForm = false;
    this.showCardUser = false;
    this.showNotification('top', 'center', '<b>'+error.message+'</b>', 'pe-7s-attention', 4);
    console.log(error.message);   
  }

  onCompleteNewUser(){
    console.log('ok');
    this.ngOnInit();
   }

  public onSubmitEditUser(){
    this.progress=true;
    console.log('Submitting values', this.formData);
     this.userService.updateUser(this.formData).subscribe(
        (response) => this.onSuccessUpdate(response.json()), 
        (error) => this.onErrorUpdate(error.json()), 
        () => this.onCompleteUpdate()
      );
  }

    onSuccessUpdate(response){
    this.showNotification('top', 'center', '<b>'+response.message+'</b>', 'pe-7s-check', 2);
    console.log(response);
  }

    onErrorUpdate(error){
    this.progress = false;
    this.showEditForm = true;
    this.showNewForm = false;
    this.showCardUser = false;
    this.showNotification('top', 'center', '<b>'+error.message+'</b>', 'pe-7s-attention', 4);
    console.log(error.message);  
  }
  
  onCompleteUpdate(){
    console.log('ok');
    this.ngOnInit();
    }

  public changeStatus(row){
    //this.getStatus(row);
    //this.formData = this.allUsers.find(ele => ele.ita == row.ita)
    this.progress=true;
    this.userService.updateStatus(row).subscribe(
        (response) => this.onSuccessStatus(response.json()), 
        (error) => this.onErrorStatus(error.json()), 
        () => this.onCompleteStatus()
      );
 
  }

  onSuccessStatus(response){
    this.showNotification('top', 'center', '<b>'+response.message+'</b>', 'pe-7s-check', 2);
    console.log(response);
  }

  onErrorStatus(error){
    this.progress = false;
    this.showNotification('top', 'center', '<b>'+error.message+'</b>', 'pe-7s-attention', 4);
    console.log(error.message);   
  }
  
  onCompleteStatus(){
    this.ngOnInit();
    //this.router.navigate(['/users']);
  }
  
  public addUser(){
    this.notify = {show: false, message: ''};
    this.notify.show = true;
    this.notify.message = 'Error';
    this.modal.close();
    this.showNotification('top', 'center', 'Usuario Agregado', 'pe-7s-check', 2);

  }

  public getRols(){
    //console.log(this.rols);
    this.userService.getRols().subscribe(
        (response) => this.rols = response.json(), 
        (error) => console.log(error.json()), 
        //() => this.onCompleteLogin()
    );
  }

  public getStatusUser(ita): void{
    //console.log(this.rols);
    this.userService.getStatus(ita).subscribe(
        (response) => this.status = response.json().status, 
        (error) => console.log(error.json()), 
        //() => this.onCompleteLogin()
    );
    //return this.status;
  }

  public getPositions(){
    //console.log(this.rols);
    this.userService.getPositions().subscribe(
        (response) => this.positions = response.json(), 
        (error) => console.log(error.json()), 
        //() => this.onCompleteLogin()
    );
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
  this.data = response.json().filter(i => i.id_rol < '4'); 
  //this.data = this.data.filter(i => i.id_rol < '4') ;
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

  isAdmin(){
    return this.userService.isAdmin();
  }

}