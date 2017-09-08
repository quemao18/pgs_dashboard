import {Component, OnInit, trigger, state, style, transition, animate, Output, EventEmitter, ViewChild} from '@angular/core';
import { Location } from '@angular/common';
import { NavbarTitleService } from '../lbd/services/navbar-title.service';
import {  Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { MediaService } from '../services/media.service';
import { AuthGuard } from '../services/auth-guard.service';
import { NotificationService, NotificationType, NotificationOptions } from '../lbd/services/notification.service';
import * as vars from '../config';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-audios',
  templateUrl: './audios.component.html',
  styleUrls: ['./audios.component.scss'],
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
export class AudiosComponent implements OnInit {

  public tableData: any;
  public data:Array<any> = [];
  public formData: any;
  public formDataEdit: any;
  public formModule: any;
  public formSubCategory: any;
  public showEditForm : boolean = false;
  public showNewForm : boolean = false;
  public progress: boolean = false;
  public status: number = 0;
  public page:number = 1;
  public pagination: number = vars.pagination;
  public url: any;
  @ViewChild('modal')
  modal: ModalComponent;
  @ViewChild('modalNewCategory')
  modalNewCategory: ModalComponent;
  @ViewChild('modalNewSubCategory')
  modalNewSubCategory: ModalComponent;
  public title: string = 'Agregar';
  public titleModal: string = 'Media';
  public titleModalEdit: string = 'Editar audio';

  public dataModules: FormControl;
  public dataSubCategory: FormControl;
  public dataUsers: FormControl;
  public dataCategory2: Array<any> = [];
  public dataSubCategory2: Array<any> = [];;
  public myFormModule: FormGroup;
  public myFormSubCategory: FormGroup;
  public myFormUsers: FormGroup;

  public disabled: boolean = false;
  public disabledSubCategory: boolean = false;
  private id: string ;
  public baseUrl:string = 'https://mx.ivoox.com/es/player_ej_';
  public compUrl:string = '_4_1.html?c1=ff6600&autoplay=true';
  
  public varUrl:string = '';

  public audioIsUpload: boolean = true;
  public audio_url: string = '';
  public _newAudio : boolean = false;
  
  constructor(private builder: FormBuilder, private _sanitizer: DomSanitizer, public mediaService: MediaService, public userService: UserService, public activatedRoute: ActivatedRoute, private navbarTitleService: NavbarTitleService, public router: Router, public authGuard: AuthGuard, public authService: AuthService,  public location: Location,  private notificationService: NotificationService) {
  
   }

  ngOnInit() {
    this.navbarTitleService.updateTitle('Audios');
    //if(!this.userService.isAdmin() && !this.userService.isAuth() )
    //    this.router.navigate(['/dashboard']);
    //this.showNotification('top', 'center', 'Debe permitir <b>ventanas emergentes</b> para reproducir el audio', 'pe-7s-attention', 3);
    this.tableData = {
    headerRow: ['Nombre', 'Módulo', 'Audio/Complemento', 'Creado por' , 'ACCIONES'],
    };

    //this.IvooxGetID("http://mx.ivoox.com/es/audio-2-crea-tu-lista-audios-mp3_rf_4653879_1.html");
    this.data = [];
    this.formData = { };
    this.formDataEdit = { };
    this.formModule = { };
    this.formSubCategory = { };
    this.myFormModule= this.builder.group({
      module : ['0', [Validators.required, Validators.minLength(3)]],
    });

    this.myFormUsers = this.builder.group({
      users: ['', [Validators.required, Validators.minLength(3)]],
    });

    //this.formData.categories.id_category = 1;
    this.showEditForm = this.showNewForm = this.progress = false;
    this.getAudios();
    this.getModules();

    this.formData.id_module = 0;
    this.formData.description = '';
    
  }

  public getModules(){
    //console.log(this.rols);
    //this.myFormSubCategory.disable();
    this.mediaService.getModules().subscribe(
        (response) => this.dataModules = response.json(), 
        (error) => console.log(error.json()), 
        //() => this.onCompleteLogin()
    );
  }



    public getUsers(){
    this.myFormUsers.disable();
    //console.log(this.rols);
    this.userService.getUsers().subscribe(
        (response) => { 
            this.myFormUsers.enable();
            this.dataUsers = response.json(); 
        }, 
        (error) => { console.log(error.json()); this.progress=false; }, 
        //() => this.onCompleteLogin()
    );
    
  }



  public getAudios(){
    this.progress = true;
    //console.log(this.rols);
    this.mediaService.getAudios().subscribe(
        (response) => this.onSuccessAudios (response),
        (error) => console.log(error.json()), 
        //() => this.onCompleteLogin()
    );
  }

  public onSuccessAudios(response){
    this.progress = false;
  //this.data = response.json().filter(i => i.id_rol < '4'); 
  //this.data = this.data.filter(i => i.id_rol < '4') ;
    this.data = response.json();
  }


     
  autocompleListFormatter = (data: any) : SafeHtml => {
    let html = `<span>${data.name}</span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  autocompleListFormatterUsers = (data: any) : SafeHtml => {
    let html = `<span>${data.name} ${data.last}</span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  public newAudio(){
    this.showNewForm = true;
    this.audioIsUpload = false;
    this.showEditForm = false;
    this.formData ={};
    this.formData.id_module = 0;
    this.formData.description = '';
    this.formData.is_audio = 1;
    this.getUsers();
  }


  public editAudio(row){
    this.showEditForm = true;
    this.formData = row;
    this.formData.is_audio = row.is_audio;
    this.formData.users = {
      "ita": row.ita_user_create,
      "name": row.name_user_create + ' ' + row.last_user_create
    };
    //console.log(row);
    this.getUsers();
  }



  public showAudio(row){
    this.formData = row;
    this.titleModal = row.name;
    //this.url = this.baseUrl + this.IvooxGetID(row.url) + this.compUrl;
    this.url = row.url;
    this.modal.open();
  }

  public onSubmitNewAudio(){
    this.progress=true;
    //if(!this.validateYouTubeUrl(this.formData.url) || !this.isUrlValid(this.formData.url))
    //     this.showNotification('top', 'center', '<b> Verifica el URL </b>', 'pe-7s-attention', 4);
    //else{
      if(this._newAudio || this.audio_url!='')
        this.formData.audio_url = this.audio_url;
      console.log('Submitting values', this.formData);
    //if(this.formData.users.ita==null)
     this.mediaService.newAudio(this.formData).subscribe(
        (response) => this.onSuccessNewAudio(response.json()), 
        (error) => this.onErrorNewAudio(error.json()), 
        () => this.onCompleteNewAudio()
      );
    //}
  }

  onSuccessNewAudio(response){
    this.showNotification('top', 'center', '<b>'+response.message+'</b>', 'pe-7s-check', 2);
    console.log(response);
    
  }

  onErrorNewAudio(error){
    this.progress = false;
    this.showNewForm = true;
    this.showEditForm = false;

    this.showNotification('top', 'center', '<b>'+error.message+'</b>', 'pe-7s-attention', 4);
    console.log(error.message);   
  }

  onCompleteNewAudio(){
    console.log('ok');
    this.ngOnInit();
   }

  public onSubmitEditAudio(){
    this.progress=true;
    if(this._newAudio || this.audio_url!='')
      this.formData.audio_url = this.audio_url;

    console.log('Submitting values', this.formData);
     this.mediaService.updateAudio(this.formData).subscribe(
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
    this.showNotification('top', 'center', '<b>'+error.message+'</b>', 'pe-7s-attention', 4);
    console.log(error.message);  
  }
  
  onCompleteUpdate(){
    console.log('ok');
    this.ngOnInit();
  }

  public changeStatus(row){

    this.progress=true;
    this.mediaService.updateStatusAudio(row).subscribe(
        (response) => this.onSuccessStatus(response.json()), 
        (error) => this.onErrorStatus(error.json()), 
        () => this.onCompleteStatus()
      );
 
  }

  onSuccessStatus(response){
    this.showNotification('top', 'center', '<b>'+response.message+'</b>', 'pe-7s-check', 2);
    //console.log(response);
  }

  onErrorStatus(error){
    this.progress = false;
    this.showNotification('top', 'center', '<b>'+error.message+'</b>', 'pe-7s-attention', 4);
    //console.log(error.message);   
  }
  
  onCompleteStatus(){
    this.ngOnInit();
    //this.router.navigate(['/users']);
  }


    public deleteAudio(row){

    this.progress=true;
    this.mediaService.deleteAudio(row).subscribe(
        (response) => this.onSuccessDeleteAudio(response.json()), 
        (error) => this.onErrorDeleteAudio(error.json()), 
        () => this.onCompleteDeleteAudio()
      );
 
  }

  onSuccessDeleteAudio(response){
    this.showNotification('top', 'center', '<b>'+response.message+'</b>', 'pe-7s-check', 2);
    //console.log(response);
  }

  onErrorDeleteAudio(error){
    this.progress = false;
    this.showNotification('top', 'center', '<b>'+error.message+'</b>', 'pe-7s-attention', 4);
    //console.log(error.message);   
  }
  
  onCompleteDeleteAudio(){
    this.ngOnInit();
    //this.router.navigate(['/users']);
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



  saveModule(){
    this.progress = true;
    this.mediaService.newModule(this.formModule).subscribe(
        (response) => this.onSuccessNewModule(response.json()), 
        (error) => this.onErrorNewModule(error.json()), 
        () => this.onCompleteNewModule()
      );

  }


  onSuccessNewModule(response){
    this.showNotification('top', 'center', '<b>'+response.message+'</b>', 'pe-7s-check', 2);
    console.log(response);
    //this.modalNewCategory.open();
    
  }

  onErrorNewModule(error){
    this.progress = false;
    this.showNotification('top', 'center', '<b>'+error.message+'</b>', 'pe-7s-attention', 4);
    console.log(error.message);  
    //setTimeout(this.modalNewCategory.open(), 1000); 
  }

  onCompleteNewModule(){
    this.progress = false;
    console.log('ok');
    this.formData.id_category = 0;
    this.formData.id_sub_category = 0;
    this.disabledSubCategory = true;
    this.getModules();
   }


  public dismissed(){
    this.url = '';
  }

  opnened(){

  }


  public  IvooxGetID(url){
  //http://mx.ivoox.com/es/audio-2-crea-tu-lista-audios-mp3_rf_4653879_1.html
  //https://mx.ivoox.com/es/player_ej_4653723_4_1.html?c1=ff6600
  url = url.split(/(rf_)/);
  url = url[2].split(/(_1)/);
  //console.log(url);
  return url[0];
  //return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
  }


  validateYouTubeUrl(url)
{
    //var url = $('#youTubeUrl').val();
        if (url != undefined || url != '') {
            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
            var match = url.match(regExp);
            if (match && match[2].length == 11) {
                // Do anything for being valid
                // if need to change the url to embed url then use below line
                return true;
                //$('#ytplayerSide').attr('src', 'https://www.youtube.com/embed/' + match[2] + '?autoplay=0');
            }
            else {
                // Do anything for not being valid
                return false;
            }
        }
}

isUrlValid(userInput) {
    var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if(res == null)
        return false;
    else
        return true;
}

public audio($event){
  this._newAudio = true;
  this.audioIsUpload = false;
}

public uploadAudio($event) {
  this._newAudio = true;
  this.audioIsUpload = false;
  //console.log($event);
  this.mediaService.fileChange($event).subscribe(
      (response) => this.onSuccessUpload(response.json()), 
      (error) => console.log(error.json()), 
      () => this.onCompleteUpload()
  )
}

onSuccessUpload(response){
  console.log(response);
  if(!response.status)
    {
      this.audioIsUpload = false;
      this.showNotification('top', 'center', '<b>'+response.message+'</b>', 'pe-7s-attention', 4);
    }else{
      this.audioIsUpload = true;
      this.formData.url = response.audio_url;
      this.audio_url = response.audio_url;
      this.formData.file_name = response.filename;
    }
  
}

onCompleteUpload(){
  this.progress = false;
  console.log('ok');

  //this.formData.id_event = 0;

 }

public audioRemoved($event){
  this.audioIsUpload = true;
  this.audio_url = '';
}

}
