import {Component, OnInit, trigger, state, style, transition, animate, Output, EventEmitter, ElementRef, ViewChild} from '@angular/core';
import { Location, DatePipe } from '@angular/common';
import { NavbarTitleService } from '../lbd/services/navbar-title.service';
import {  Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { NewService } from '../services/new.service';
import { AuthGuard } from '../services/auth-guard.service';
import { NotificationService, NotificationType, NotificationOptions } from '../lbd/services/notification.service';
import * as vars from '../config';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import {INgxMyDpOptions, IMyDateModel} from 'ngx-mydatepicker';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
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
export class NewsComponent implements OnInit {

  public tableData: any;
  public data:Array<any> = [];
  public formData: any;
  public formDataEdit: any;
  public formDataView: any;
  public formEvent: any;
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
  @ViewChild('modalNewEvent')
  modalNewEvent: ModalComponent;

  @ViewChild("datepickerE") datepickerE: ElementRef;
  public isShowDatepicker: boolean = false;

  public title: string = 'Agregar';
  public titleModal: string = 'Media';
  public titleModalEdit: string = 'Editar Multimedia';

  public dataEvents: FormControl;
  public dataSubCategory: FormControl;
  public dataUsers: FormControl;
  public dataCategory2: Array<any> = [];
  public dataSubCategory2: Array<any> = [];;
  public myFormCategory: FormGroup;
  public myFormSubCategory: FormGroup;
  public myFormUsers: FormGroup;
  public url_upload : string = vars.apiUrl+ "/news/upload/"+vars.nameKeyApi+"/"+vars.keyApi; //"http://localhost:8080/npeht_api/api/news/upload/X-API-KEY/LCiAE8C30IQIuG8s27gtU0b6eZ7hlXzSKBcqFaes" ;
  public imageIsUpload: boolean = false;
  public banner_url: string = '';
  public newPic : boolean = false;

  constructor(public datePipe:DatePipe, private builder: FormBuilder, private _sanitizer: DomSanitizer, public newService: NewService, public userService: UserService, public activatedRoute: ActivatedRoute, private navbarTitleService: NavbarTitleService, public router: Router, public authGuard: AuthGuard, public authService: AuthService,  public location: Location,  private notificationService: NotificationService) {
  
   }

  ngOnInit() {
    this.navbarTitleService.updateTitle('Videos');

    this.tableData = {
    headerRow: ['Nombre', 'Evento', 'Desde', 'Hasta' , 'ACCIONES'],
    };

    this.data = [];
    this.formData = { };
    this.formDataView = { };
    this.formEvent = { };
    this.banner_url = '';

    this.showEditForm = this.showNewForm = this.progress = this.imageIsUpload = this.newPic = false;
    this.getNews();
    this.getEvents();
    this.formData.id_event = 0;
    this.formData.banner_url = '';
    
    this.formData.date_from = {jsdate: new Date()};   // initialize today with jsdate property
    this.formData.date_finish = {jsdate: new Date()};   // initialize today with jsdate property


  }

  private myOptions: INgxMyDpOptions = {
        // other options...
        dateFormat: 'dd/mm/yyyy',
    };

    // Initialized to specific date (09.10.2018)
  private model: Object = { date: { year: 2018, month: 10, day: 9 } };


  onDateChanged(event: IMyDateModel): void {
        // date selected
        console.log(new Date(event.jsdate).toISOString());
    
    }

  public dismissed(){
    this.formData.date_from =   this.datePipe.transform(this.formData.date_from.jsdate, 'yyyy-MM-dd');
    this.formData.date_finish = this.datePipe.transform(this.formData.date_finish.jsdate, 'yyyy-MM-dd');
  }

    public getEvents(){
    //console.log(this.rols);
    //this.myFormSubCategory.disable();
    this.newService.getEvents().subscribe(
        (response) => this.dataEvents = response.json(), 
        (error) => console.log(error.json()), 
        //() => this.onCompleteLogin()
    );
  }


    public getNews(){
    this.progress = true;
    //console.log(this.rols);
    this.newService.getNews().subscribe(
        (response) => this.onSuccessNews (response),
        (error) => console.log(error.json()), 
        //() => this.onCompleteLogin()
    );
  }

  public onSuccessNews(response){
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

  public newNew(){
    this.showNewForm = true;
    this.showEditForm = false;
    this.formData.id_event = 0;
    this.formData.date_from = {jsdate: new Date()};   // initialize today with jsdate property
    this.formData.date_finish = {jsdate: new Date()};   // initialize today with jsdate property
    //this.formData ={};
    }


  public edit(row){
    this.showEditForm = true;
    this.formData = row;
    this.imageIsUpload = true;
    //console.log(this.datePipe.transform(row.date_from, 'dd/MM/yyyy'));
    this.formData.date_from =  {jsdate: new Date(row.date_from)};
    this.formData.date_finish = {jsdate: new Date(row.date_finish)};
    this.formData.banner_url = row.banner_url;
    //this.formData.date_from = {date: {year: date_from.getFullYear(), month: date_from.getMonth(), day: date_from.getDay()}};   // this example is initialized to specific date
    //this.formData.date_finish = {date: {year: date_finish.getFullYear(), month: date_finish.getMonth(), day: date_finish.getDay()}};   // this example is initialized to specific date
  }


  public onSubmitNew(){
    this.progress=true;
      //let time = new Date().getTime();      
      this.formData.date_from =   this.datePipe.transform(this.formData.date_from.jsdate, 'yyyy-MM-dd');
      this.formData.date_finish = this.datePipe.transform(this.formData.date_finish.jsdate, 'yyyy-MM-dd');
      this.formData.banner_url = this.banner_url;
      console.log('Submitting values', this.formData);
     this.newService.newNew(this.formData).subscribe(
        (response) => this.onSuccessNew(response.json()), 
        (error) => this.onErrorNew(error.json()), 
        () => this.onCompleteNew()
      );
  
  }

  onSuccessNew(response){
    this.showNotification('top', 'center', '<b>'+response.message+'</b>', 'pe-7s-check', 2);
    console.log(response);
    
  }

  onErrorNew(error){
    this.progress = false;
    this.showNewForm = true;
    this.showEditForm = false;
    this.formData = {};
    this.formData.date_from = this.formData.date_finish = '';
    this.formData.id_event = 0;
    this.showNotification('top', 'center', '<b>'+error.message+'</b>', 'pe-7s-attention', 4);
    console.log(error.message);   
  }

  onCompleteNew(){
    console.log('ok');
    this.ngOnInit();
   }

  public onSubmitEdit(){
    this.progress=true;
    //if(this.formData.date_from.jsdate!='')
    this.formData.date_from =   this.datePipe.transform(this.formData.date_from.jsdate, 'yyyy-MM-dd');
    //if(this.formData.date_finish.jsdate!='')
    this.formData.date_finish = this.datePipe.transform(this.formData.date_finish.jsdate, 'yyyy-MM-dd');
    if(this.newPic || this.banner_url!='')
    this.formData.banner_url = this.banner_url;
    
    console.log('Submitting values', this.formData);
     this.newService.updateNew(this.formData).subscribe(
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
    this.newService.updateStatus(row).subscribe(
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


    public delete(row){

    this.progress=true;
    this.newService.deleteNew(row).subscribe(
        (response) => this.onSuccessDelete(response.json()), 
        (error) => this.onErrorDelete(error.json()), 
        () => this.onCompleteDelete()
      );
 
  }

  onSuccessDelete(response){
    this.showNotification('top', 'center', '<b>'+response.message+'</b>', 'pe-7s-check', 2);
    //console.log(response);
  }

  onErrorDelete(error){
    this.progress = false;
    this.showNotification('top', 'center', '<b>'+error.message+'</b>', 'pe-7s-attention', 4);
    //console.log(error.message);   
  }
  
  onCompleteDelete(){
    this.ngOnInit();
    //this.router.navigate(['/users']);
  }


    saveEvent(){
    this.progress = true;
    this.newService.newEvent(this.formEvent).subscribe(
        (response) => this.onSuccessNewEvent(response.json()), 
        (error) => this.onErrorNewEvent(error.json()), 
        () => this.onCompleteNewEvent()
      );

  }


  onSuccessNewEvent(response){
    this.showNotification('top', 'center', '<b>'+response.message+'</b>', 'pe-7s-check', 2);
    console.log(response);
    //this.modalNewCategory.open();
    
  }

  onErrorNewEvent(error){
    this.progress = false;
    this.showNotification('top', 'center', '<b>'+error.message+'</b>', 'pe-7s-attention', 4);
    console.log(error.message);  
    //setTimeout(this.modalNewCategory.open(), 1000); 
  }

  onCompleteNewEvent(){
    this.progress = false;
    console.log('ok');
    this.getEvents();
    //this.formData.id_event = 0;

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

  public uploadImage($event) {
    this.newPic = true;
    this.imageIsUpload = false;
    console.log($event);
    this.newService.fileChange($event).subscribe(
        (response) => this.onCompleteUpload(response.json()), 
        (error) => console.log(error.json()), 
        () => this.onCompleteNewEvent()
    )
  }

  onCompleteUpload(response){
    console.log(response);
    this.imageIsUpload = true;
    this.banner_url = response.banner_url;
    
  }

  public imageRemoved($event){
    this.imageIsUpload = false;
  }

  public cancel(){
    console.log(this.formData);
    this.formData.date_from =   this.datePipe.transform(this.formData.date_from.jsdate, 'yyyy-MM-dd');
    this.formData.date_finish = this.datePipe.transform(this.formData.date_finish.jsdate, 'yyyy-MM-dd');
  }

    public showNew(row){
    this.formDataView = row;
    this.imageIsUpload = true;
    //console.log(this.datePipe.transform(row.date_from, 'dd/MM/yyyy'));
    this.modal.open();
  }


}
