import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { Location, DatePipe } from '@angular/common';
import { NavbarTitleService } from '../lbd/services/navbar-title.service';
import {  Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { SchoolService } from '../services/school.service';
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

import {INgxMyDpOptions, IMyDateModel} from 'ngx-mydatepicker';

import { trigger, state, transition, style, animate } from '@angular/animations';
import { CompanyService } from '../services/company.service';
import { AngularFireStorage } from '@angular/fire/storage';


@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
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
export class CompaniesComponent implements OnInit {

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
  @ViewChild('modal', {static:true})
  modal: ModalComponent;
  @ViewChild('modalNewCategory', {static:true})
  modalNewCategory: ModalComponent;
  @ViewChild('modalNewSubCategory', {static:true})
  modalNewSubCategory: ModalComponent;
  public title: string = 'Agregar';
  public titleModal: string = 'Media';
  public titleModalEdit: string = 'Editar Multimedia';

  public dataCategory: FormControl;
  public dataSubCategory: FormControl;
  public dataUsers: any;
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
  @ViewChild("remoteDataCreator", {static:true}) private remoteDataCreator: CompleterCmp;
  public name: string;
  public placeholderCreator: string;
  public customData: CustomData;

  public search:string ='';

  @ViewChild("datepickerE", {static:true}) datepickerE: ElementRef;
  public isShowDatepicker: boolean = false;
  imageIsUpload:boolean = false;
  newPic:boolean = false;
  logo:string;
  ref: any;
  task:any;
  downloadURL:string;
  uploadProgress:any;


  constructor(private afStorage: AngularFireStorage, public datePipe:DatePipe, private http: Http, private completerService: CompleterService, private builder: FormBuilder, private _sanitizer: DomSanitizer, public companyService: CompanyService, public userService: UserService, public activatedRoute: ActivatedRoute, private navbarTitleService: NavbarTitleService, public router: Router, public authGuard: AuthGuard, public authService: AuthService,  public location: Location,  private notificationService: NotificationService) {
    this.customData = new CustomData(userService, http); 
   }

  ngOnInit() {
    this.navbarTitleService.updateTitle('Aseguradoras');
    //if(!this.userService.isAdmin() && !this.userService.isAuth() )
    //    this.router.navigate(['/dashboard']);
    //this.showNotification('top', 'center', 'Debe permitir <b>ventanas emergentes</b> para reproducir el video', 'pe-7s-attention', 3);
    this.tableData = {
    headerRow: ['Nombre', 'Email', 'Descripción', 'ACCIONES'],
    };

    this.data = [];
    this.formData = { };
    this.formDataEdit = { };
    this.downloadURL = '';
    this.myFormCategory = this.builder.group({
      category : ['0', [Validators.required, Validators.minLength(3)]],
    });


    //this.formData.categories.id_category = 1;
    this.showEditForm = this.showNewForm = this.progress = false;
    this.getCompanies(this.search);
  }

    //onSelect(countryid) {
    //  this.dataSubCategory = this.mediaService.getSubCategories().filter((item)=> item.countryid == countryid);
    //}

    private myOptions: INgxMyDpOptions = {
      // other options...
      dateFormat: 'dd/mm/yyyy',
  };

  private model: Object = { date: { year: 2018, month: 10, day: 9 } };
  
  
    onDateChanged(event: IMyDateModel): void {
          // date selected
          console.log(new Date(event.jsdate).toISOString());
      
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



  public getCompanies(q:string){
    this.progress = true;
    //console.log(this.rols);
    this.companyService.getCompanies(q).subscribe(
        (response) => this.onSuccessCompanies (response),
        (error) => { 
          this.showNotification('top', 'center', '<b>Error</b>', 'pe-7s-attention', 4); 
          this.data = []; 
          console.log(error.json()); 
          this.progress=false; 
        }, 
        //() => this.onCompleteLogin()
    );
  }

  public onSuccessCompanies(response){
    this.progress = false;
  //this.data = response.json().filter(i => i.id_rol < '4'); 
  //this.data = this.data.filter(i => i.id_rol < '4') ;
    this.data = response;
  }


     
  autocompleListFormatter = (data: any) : SafeHtml => {
    let html = `<span>${data.name}</span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  autocompleListFormatterUsers = (data: any) : SafeHtml => {
    let html = `<span>${data.name} ${data.last}</span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  public newCompany(){
    this.showNewForm = true;
    this.showEditForm = false;
    this.formData ={};
  }


  public editCompany(row:any){
    this.showEditForm = true;
    this.formData = row;
    this.downloadURL = '';
    //this.formData.company_id = row.company_id;
    //console.log(this.formData)
    //this.formData.url = row.url;
  }

  public cancel(){
    console.log(this.formData);
    //this.formData.date_from =   this.datePipe.transform(this.formData.date_from.jsdate, 'yyyy-MM-dd');
    //this.formData.date_finish = this.datePipe.transform(this.formData.date_finish.jsdate, 'yyyy-MM-dd');
  }


  public showCompany(row){
    this.formData = row;
    this.titleModal = row.name;
    //this.id = this.YouTubeGetID(row.url);
    //this.url = this._sanitizer.bypassSecurityTrustResourceUrl(this.baseUrl + this.id);    
    //this.url = this.baseUrl+this.YouTubeGetID(row.url)+this.compUrl;

    this.modal.open();
  }


  public  YouTubeGetID(url){
  url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
  }


  public onSubmitNewCompany(){
    this.progress=true;
    //if(!this.validateYouTubeUrl(this.formData.url) || !this.isUrlValid(this.formData.url))
    //     this.showNotification('top', 'center', '<b> Verifica el URL </b>', 'pe-7s-attention', 4);
    //else{
      this.formData.duration = this.duration;
      console.log('Submitting values', this.formData);
    //if(this.formData.users.ita==null)
     this.companyService.postCompany(this.formData).subscribe(
        (response) => this.onSuccessNewCompany(response), 
        (error) => this.onErrorNewCompany(error), 
        () => this.onCompleteNewCompany()
      );
    //}
  }

  onSuccessNewCompany(response){
    this.showNotification('top', 'center', '<b>Aseguradora creada</b>', 'pe-7s-check', 2);
    console.log(response);
    
  }

  onErrorNewCompany(error){
    this.progress = false;
    this.showNewForm = true;
    this.showEditForm = false;

    this.showNotification('top', 'center', '<b>Error</b>', 'pe-7s-attention', 4);
    console.log(error);   
  }

  onCompleteNewCompany(){
    console.log('ok');
    this.ngOnInit();
   }

  public onSubmitEditCompany(){
    this.progress=true;
    
    //this.formData.date_finish = this.datePipe.transform(this.formData.date_finish.jsdate, 'yyyy-MM-dd');
    console.log('Submitting values', this.formData);
     this.companyService.putCompany(this.formData).subscribe(
        (response) => this.onSuccessUpdate(response), 
        (error) => this.onErrorUpdate(error), 
        () => this.onCompleteUpdate()
      );
  }

  onSuccessUpdate(response){
    this.showNotification('top', 'center', '<b>Actualizada correctamente</b>', 'pe-7s-check', 2);
    console.log(response);
  }

  onErrorUpdate(error){
    this.progress = false;
    this.showEditForm = true;
    this.showNewForm = false;
    this.showNotification('top', 'center', '<b>Error</b>', 'pe-7s-attention', 4);
    console.log(error);  
  }
  
  onCompleteUpdate(){
    console.log('ok');
    this.ngOnInit();
  }

  public changeStatus(row:any){

    this.progress=true;
    this.companyService.putStatus(row.company_id).subscribe(
        (response) => this.onSuccessStatus(response), 
        (error) => this.onErrorStatus(error), 
        () => this.onCompleteStatus()
      );
 
  }

  onSuccessStatus(response){
    this.showNotification('top', 'center', '<b>Estado cambiado</b>', 'pe-7s-check', 2);
    //console.log(response);
  }

  onErrorStatus(error){
    console.log(error);
    this.progress = false;
    this.showNotification('top', 'center', '<b>Error</b>', 'pe-7s-attention', 4);
    //console.log(error.message);   
  }
  
  onCompleteStatus(){
    this.ngOnInit();
    //this.router.navigate(['/users']);
  }


    public deleteSchool(row){

    this.progress=true;
    this.companyService.deleteCompany(row).subscribe(
        (response) => this.onSuccessDelete(response), 
        (error) => this.onErrorDelete(error), 
        () => this.onCompleteDelete()
      );
 
  }

  onSuccessDelete(response){
    this.showNotification('top', 'center', '<b>Eliminada correctamente</b>', 'pe-7s-check', 2);
    //console.log(response);
  }

  onErrorDelete(error){
    this.progress = false;
    this.showNotification('top', 'center', '<b>Error</b>', 'pe-7s-attention', 4);
    //console.log(error.message);   
  }
  
  onCompleteDelete(){
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



  public dismissed(){
    this.url = '';
  }

  
  public image($event){
    this.newPic = true;
    this.imageIsUpload = false;
  }

  uploadFirebase(event: any) {
    const randomId = Math.random().toString(36).substring(2);
    this.ref = this.afStorage.ref('companies/logos/'+this.formData.company_id);
    this.task = this.ref.put(event.target.files[0]);
    //this.uploadProgress = this.task.percentageChanges();
    //this.uploadProgress = (this.task.snapshot.getBytesTransferred() / this.task.snapshot.getTotalBytes()) * 100;
    //this.downloadURL = this.task.downloadURL();
    this.uploadProgress = true;
    const downloadURL = this.ref.getDownloadURL().subscribe(url => { 
      this.downloadURL = url;
      console.log(this.downloadURL)
      this.formData.logo = this.downloadURL;
      this.companyService.putLogoUrl(this.downloadURL, this.formData.company_id).subscribe(
        data => {
          console.log(data)
          this.uploadProgress = false;
        }
      )
    });
  }

  onSuccessUpload(response:any){
    console.log(response);
    if(!response)
      {
        this.imageIsUpload = false;
        this.showNotification('top', 'center', '<b>Error</b>', 'pe-7s-attention', 4);
      }else{
        this.imageIsUpload = true;
        this.formData.logo = response.logo;
        this.logo = response.logo;
      }
    
  }

  onCompleteUpload(){
    this.progress = false;
    console.log('ok');

    //this.formData.id_event = 0;

   }

  public imageRemoved($event){
    this.imageIsUpload = false;
    this.downloadURL = this.formData.logo;
  }

isUrlValid(userInput) {
    var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if(res == null)
        return false;
    else
        return true;
}

}
