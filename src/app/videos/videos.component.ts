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

import { CompleterCmp, CompleterItem, CompleterService, CompleterData, RemoteData } from 'ng2-completer';
import { Http, Headers, URLSearchParams, RequestOptions, Jsonp } from '@angular/http';
import { CustomData } from "../services/custom-data";

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
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
export class VideosComponent implements OnInit {

  public tableData: any;
  public data:Array<any> = [];
  public formData: any;
  public formDataEdit: any;
  public formCategory: any;
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
  public titleModalEdit: string = 'Editar Multimedia';

  public dataCategory: FormControl;
  public dataSubCategory: FormControl;
  public dataUsers: FormControl;
  public dataCategory2: Array<any> = [];
  public dataSubCategory2: Array<any> = [];;
  public myFormCategory: FormGroup;
  public myFormSubCategory: FormGroup;
  public myFormUsers: FormGroup;

  public disabled: boolean = false;
  public disabledSubCategory: boolean = false;
  private id: string ;
  public baseUrl:string = 'https://www.youtube.com/embed/';
  public compUrl:string = '?rel=0&autoplay=1';
  public duration: number = 0;
  public busy: boolean = false;
  public creator: any;
  public q : string = '';
  @ViewChild("remoteDataCreator") private remoteDataCreator: CompleterCmp;
  public name: string;
  public placeholderCreator: string;
  public customData: CustomData;

  public search:string ='';
  
  constructor(private http: Http, private completerService: CompleterService, private builder: FormBuilder, private _sanitizer: DomSanitizer, public mediaService: MediaService, public userService: UserService, public activatedRoute: ActivatedRoute, private navbarTitleService: NavbarTitleService, public router: Router, public authGuard: AuthGuard, public authService: AuthService,  public location: Location,  private notificationService: NotificationService) {
    this.customData = new CustomData(userService, http); 
   }

  ngOnInit() {
    this.navbarTitleService.updateTitle('Videos');
    //if(!this.userService.isAdmin() && !this.userService.isAuth() )
    //    this.router.navigate(['/dashboard']);
    //this.showNotification('top', 'center', 'Debe permitir <b>ventanas emergentes</b> para reproducir el video', 'pe-7s-attention', 3);
    this.tableData = {
    headerRow: ['Nombre', 'Categoría', 'Sub Categoría', 'Creado por' , 'ACCIONES'],
    };

    this.data = [];
    this.formData = { };
    this.formDataEdit = { };
    this.formCategory = { };
    this.formSubCategory = { };
    this.myFormCategory = this.builder.group({
      category : ['0', [Validators.required, Validators.minLength(3)]],
    });

    this.myFormSubCategory = this.builder.group({
      sub_category :  ['0', [Validators.required, Validators.minLength(3)]],
    });

    this.myFormUsers = this.builder.group({
      users : "",
    });

    this.myFormUsers = this.builder.group({
      users: ['', [Validators.required, Validators.minLength(3)]],
    });

    //this.formData.categories.id_category = 1;
    this.showEditForm = this.showNewForm = this.progress = false;
    this.getMedias(this.search);
    this.getCategories();
    //this.getSubCategoriesAll();
    //this.getSubCategories();
    this.formData.id_category = 0;
    this.formData.id_sub_category = 0;
    this.formData.description = '';
    this.formData.duration = 0;
    this.placeholderCreator = 'Nombre del creador';
    
  }

  public getCategories(){
    //console.log(this.rols);
    //this.myFormSubCategory.disable();
    this.mediaService.getCategories().subscribe(
        (response) => this.dataCategory = response.json(), 
        (error) => console.log(error.json()), 
        //() => this.onCompleteLogin()
    );
  }

    //onSelect(countryid) {
    //  this.dataSubCategory = this.mediaService.getSubCategories().filter((item)=> item.countryid == countryid);
    //}

  public getSubCategories(id_category){
     //console.log(id_category);
      this.disabledSubCategory = true;
       this.formCategory.id_sub_category=0;
       this.mediaService.getSubCategories(0).subscribe(
        (response) => {
          this.dataSubCategory = response.json().filter(i => i.id_category == id_category); 
          this.formCategory.id_sub_category=0;
          this.disabledSubCategory = false;
        }, 
        (error) => console.log(error.json()), 
        //() => this.onCompleteLogin()
    );
  }


  public onCreatorSelected(selected: CompleterItem) {
    if (selected) {
      //console.log(selected.originalObject);
        this.formData.users = {
          "id_user": selected.originalObject.id_user,
          "name": selected.originalObject.name + ' ' + selected.originalObject.last
        };
        this.remoteDataCreator.blur();
    } else {
        this.formData.users = {};
    }
    //console.log(this.formData);
  }


    public getUsers(q){
    this.myFormUsers.disable();
    //console.log(this.rols);
    this.userService.getUsers(q).subscribe(
        (response) => { 
            this.myFormUsers.enable();
            this.dataUsers = response.json(); 
        }, 
        (error) => { console.log(error.json()); this.progress=false; }, 
        //() => this.onCompleteLogin()
    );
    
  }



  public getMedias(q){
    this.progress = true;
    //console.log(this.rols);
    this.mediaService.getMedias(q).subscribe(
        (response) => this.onSuccessMedias (response),
        (error) => { 
          this.showNotification('top', 'center', '<b>'+error.json().message+'</b>', 'pe-7s-attention', 4); 
          this.data = []; 
          console.log(error.json()); 
          this.progress=false; 
        }, 
        //() => this.onCompleteLogin()
    );
  }

  public onSuccessMedias(response){
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

  public newMedia(){
    this.showNewForm = true;
    this.showEditForm = false;
    this.formData ={};
    this.formData.id_category = 0;
    this.formData.id_sub_category = 0;
    this.formData.description = '';
    this.disabledSubCategory = true;
    this.placeholderCreator = 'Nombre del creador';
    this.creator = '';
  }


  public editMedia(row){
    this.showEditForm = true;
    this.formData = row;
    this.getSubCategories(row.id_category);
    this.formData.users = {
      "id_user": row.id_user_create,
      "name": row.name_user_create + ' ' + row.last_user_create
    };
    this.creator = row.name_user_create + ' ' + row.last_user_create;
  }



  public showMedia(row){
    this.formData = row;
    this.titleModal = row.name;
    //this.id = this.YouTubeGetID(row.url);
    //this.url = this._sanitizer.bypassSecurityTrustResourceUrl(this.baseUrl + this.id);    
    this.url = this.baseUrl+this.YouTubeGetID(row.url)+this.compUrl;

    this.modal.open();
  }


  public  YouTubeGetID(url){
  url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
  }

  public fixUrl(){
    this.formData.url = this.formData.url.substring(0, this.formData.url.indexOf('&'));
  }

  public onSubmitNewMedia(){
    this.progress=true;
    //if(!this.validateYouTubeUrl(this.formData.url) || !this.isUrlValid(this.formData.url))
    //     this.showNotification('top', 'center', '<b> Verifica el URL </b>', 'pe-7s-attention', 4);
    //else{
      //this.formData.url = this.formData.url.substring(0, this.formData.url.indexOf('?'));
      this.formData.duration = this.duration;
      console.log('Submitting values', this.formData);
    //if(this.formData.users.ita==null)
     this.mediaService.newMedia(this.formData).subscribe(
        (response) => this.onSuccessNewMedia(response.json()), 
        (error) => this.onErrorNewMedia(error.json()), 
        () => this.onCompleteNewMedia()
      );
    //}
  }

  onSuccessNewMedia(response){
    this.showNotification('top', 'center', '<b>'+response.message+'</b>', 'pe-7s-check', 2);
    console.log(response);
    
  }

  onErrorNewMedia(error){
    this.progress = false;
    this.showNewForm = true;
    this.showEditForm = false;

    this.showNotification('top', 'center', '<b>'+error.message+'</b>', 'pe-7s-attention', 4);
    console.log(error.message);   
  }

  onCompleteNewMedia(){
    console.log('ok');
    this.ngOnInit();
   }

  public onSubmitEditMedia(){
    this.progress=true;
    
    this.formData.duration = this.duration;
    console.log('Submitting values', this.formData);
     this.mediaService.updateMedia(this.formData).subscribe(
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
    this.mediaService.updateStatus(row).subscribe(
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


    public deleteMedia(row){

    this.progress=true;
    this.mediaService.deleteMedia(row).subscribe(
        (response) => this.onSuccessDeleteMedia(response.json()), 
        (error) => this.onErrorDeleteMedia(error.json()), 
        () => this.onCompleteDeleteMedia()
      );
 
  }

  onSuccessDeleteMedia(response){
    this.showNotification('top', 'center', '<b>'+response.message+'</b>', 'pe-7s-check', 2);
    //console.log(response);
  }

  onErrorDeleteMedia(error){
    this.progress = false;
    this.showNotification('top', 'center', '<b>'+error.message+'</b>', 'pe-7s-attention', 4);
    //console.log(error.message);   
  }
  
  onCompleteDeleteMedia(){
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

  getDuration(){
    //this.progress = true;
    this.busy = true;
    //console.log(this.formSubCategory);
    this.mediaService.getDuration(this.formData.url).subscribe(
        (response) =>{ this.duration = (response.json()) }, 
        (error) =>console.log(error.json()), 
        () => {console.log('Done'), this.busy = false;}
      );

  }

  saveSubCategory(){
    this.progress = true;
    //console.log(this.formSubCategory);
    this.mediaService.newSubCategory(this.formSubCategory).subscribe(
        (response) => this.onSuccessNewSubCategory(response.json()), 
        (error) => this.onErrorNewSubCategory(error.json()), 
        () => this.onCompleteNewSubCategory()
      );

  }


  onSuccessNewSubCategory(response){
    this.showNotification('top', 'center', '<b>'+response.message+'</b>', 'pe-7s-check', 2);
    console.log(response);
    
  }

  onErrorNewSubCategory(error){
    this.progress = false;
    this.showNotification('top', 'center', '<b>'+error.message+'</b>', 'pe-7s-attention', 4);
    console.log(error.message);
    //setTimeout(this.modalNewSubCategory.open(), 1000);
  }

  onCompleteNewSubCategory(){
    this.progress = false;
    //console.log('ok');
    this.formData.id_category = 0;
    this.formData.id_sub_category = 0;
    this.disabledSubCategory = true;
    this.getCategories();
   }

  saveCategory(){
    this.progress = true;
    this.mediaService.newCategory(this.formCategory).subscribe(
        (response) => this.onSuccessNewCategory(response.json()), 
        (error) => this.onErrorNewCategory(error.json()), 
        () => this.onCompleteNewCategory()
      );

  }


  onSuccessNewCategory(response){
    this.showNotification('top', 'center', '<b>'+response.message+'</b>', 'pe-7s-check', 2);
    console.log(response);
    //this.modalNewCategory.open();
    
  }

  onErrorNewCategory(error){
    this.progress = false;
    this.showNotification('top', 'center', '<b>'+error.message+'</b>', 'pe-7s-attention', 4);
    console.log(error.message);  
    //setTimeout(this.modalNewCategory.open(), 1000); 
  }

  onCompleteNewCategory(){
    this.progress = false;
    console.log('ok');
    this.formData.id_category = 0;
    this.formData.id_sub_category = 0;
    this.disabledSubCategory = true;
    this.getCategories();
   }


  public dismissed(){
    this.url = '';
  }

  opnened(){

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

ValidURL(str) {
  var pattern = new RegExp('^(https?:\/\/)?'+ // protocol
    '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
    '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
    '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
    '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
    '(\#[-a-z\d_]*)?$','i'); // fragment locater
  if(!pattern.test(str)) {
    alert("Please enter a valid URL.");
    return false;
  } else {
    return true;
  }
}

}
