import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NavbarTitleService } from '../lbd/services/navbar-title.service';
import { TableData } from '../lbd/lbd-table/lbd-table.component';
import { Router } from '@angular/router';
import { NotificationService, NotificationType, NotificationOptions } from '../lbd/services/notification.service';
import * as vars from '../config';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { UserService } from '../services/user.service';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { trigger, state, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-user',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations: [
    trigger('cardtable1', [
      state('*', style({
        transform: 'translate3D(0px, 0px, 0px)',
        opacity: 1})),
      transition('void => *', [
        style({opacity: 0,
          transform: 'translate3D(0px, 150px, 0px)',
        }),
        animate('0.3s 0s ease-out')
      ])
    ]),
    trigger('cardtable2', [
      state('*', style({
        transform: 'translate3D(0px, 0px, 0px)',
        opacity: 1})),
      transition('void => *', [
        style({opacity: 0,
          transform: 'translate3D(0px, 150px, 0px)',
        }),
        animate('0.3s 0.25s ease-out')
      ])
    ]),
   trigger('carduserprofile', [
      state('*', style({
        transform: 'translate3D(0px, 0px, 0px)',
        opacity: 1
      })),
      transition('void => *', [
        style({opacity: 0,
          transform: 'translate3D(0px, 150px, 0px)',
        }),
        animate('0.3s 0s ease-out'),
      ])
    ]),
    trigger('cardprofile', [
      state('*', style({
        transform: 'translate3D(0px, 0px, 0px)',
        opacity: 1})),
      transition('void => *', [
        style({opacity: 0,
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

  @ViewChild('modalEdit', {static:true})
  modalEdit: ModalComponent;
  @ViewChild('modal', {static:true})
  modal: ModalComponent;

  public search:string ='';

  public formCompany: any;
  public formSubCompany: any;
  public myFormCompany: FormGroup;
  public myFormSubCompany: FormGroup;
  public disabledSubCompany: boolean = false;
  public dataCompany: any;
  public dataSubCompany: FormControl;
  

  constructor(private userService: UserService, private navbarTitleService: NavbarTitleService, private notificationService: NotificationService, private router: Router) {

   }

  public ngOnInit() {
    
    this.navbarTitleService.updateTitle('Usuarios');
    if(!this.userService.isAdmin() && !this.userService.isAuth() )
        this.router.navigate(['/dashboard']);

    //this.notify = {show: false, message: ''};
    this.tableData = {
    headerRow: ['Nombre', 'Apellido', 'Email', 'Empresa', 'Organización', 'ROL' , 'ACCIONES'],
  };

    this.data = [];
    this.formData = {
      ita: '',
      email: '',
      name: '',
      last: '',
      address: '',
      id_position: '',
      id_rol: 0,
      id_company:0,
      id_sub_company:0,
      status:''
    };

    this.showCardUser = this.showEditForm = this.showNewForm = this.progress = false;
    this.getRols();    
    this.getPositions();
    this.getUsersBackend(this.search);

    this.formCompany = { };
    this.formSubCompany= { };


    this.getCompanies();

    this.formData.id_company = 0;
    this.formData.id_sub_company = 0;

  }


  public getCompanies() {
    //this.progress = true;
    this.userService.getCompanies().subscribe(
      (response) => this.dataCompany = response, 
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
         //this.dataSubCompany = response.json().filter(i => i.id_company == id_company); 
         this.formCompany.id_sub_company=0;
         this.disabledSubCompany = false;
       }, 
       (error) => console.log(error.json()), 
       //() => this.onCompleteLogin()
   );
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

    this.formData = {
      ita: '',
      email: '',
      name: '',
      last: '',
      address: '',
      id_position: '',
      phone:'',
      id_rol: 4,
      status:1,
      password:'',
      id_company:0,
      id_sub_company:0,
      photo:'',
      id_question:1,

    };

  }


  public editUser(row){
    this.showEditForm = true;
    this.showCardUser = false;
    this.formData = row;
    this.getSubCompanies(row.id_sub_company);
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
        (response) => this.onSuccessNewUser(response), 
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
        (response) => this.onSuccessUpdate(response), 
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
        (response) => this.onSuccessStatus(response), 
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
        (response) => this.rols = response, 
        (error) => console.log(error.json()), 
        //() => this.onCompleteLogin()
    );
  }

  public getPositions(){
    //console.log(this.rols);
    this.userService.getPositions().subscribe(
        (response) => this.positions = response, 
        (error) => console.log(error.json()), 
        //() => this.onCompleteLogin()
    );
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

  public getUsersBackend(q){
    this.progress = true;
    //console.log(this.rols);
    this.userService.getUsersBackEnd(q).subscribe(
        (response) => this.onSuccessUsers (response),
        (error) => { 
          this.showNotification('top', 'center', '<b>'+error.json().message+'</b>', 'pe-7s-attention', 4); 
          console.log(error.json()); 
          this.progress=false; 
          this.data = [];
        }, 
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