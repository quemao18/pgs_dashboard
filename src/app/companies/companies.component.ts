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
import { UploadService } from '../services/upload.service';
import { PlanService } from '../services/plan.service';
import { AgGridAngular } from 'ag-grid-angular';
import { AgGridEvent } from 'ag-grid-community';
import { NumericEditor } from '../numeric-editor.component';



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
  public dataPlan:any;
  public formData: any;
  public formDataEdit: any;
  public formCategory: any;
  public formSubCategory: any;
  public showEditForm : boolean = false;
  public showNewForm : boolean = false;
  public showPlans : boolean = false;
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
  public dataSubCategory2: Array<any> = [];
  companyName: string;
  showNewFormPlan: boolean = false;
  formDataPlan: any = {};
  headerRowPlan: string[];

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
  file: File;

  @ViewChild("datepickerE", {static:true}) datepickerE: ElementRef;
  public isShowDatepicker: boolean = false;
  imageIsUpload:boolean = false;
  newPic:boolean = false;
  logo:string;
  ref: any;
  task:any;
  downloadURL:string;
  uploadProgress:number;
  prices = [0, 0, 0];
  titlePlan:string='';
  company_id: any;
  width_cell: number = 118;
  // @ViewChild('agGrid', {static:true}) agGrid: AgGridAngular;
  @ViewChild('agGrid', {static:true}) agGrid: AgGridAngular;
  private frameworkComponents;

  columnDefs = [
    {headerName: 'Edad',     field: 'age_range', editable:false, width:150},
    {headerName: 'Opción 1', field: 'price1', cellEditor: 'numericEditor', valueFormatter: function(params) {return params.value;},  editable:true, width:this.width_cell},
    {headerName: 'Opción 2', field: 'price2', cellEditor: 'numericEditor', valueFormatter: function(params) {return params.value;},  editable:true, width:this.width_cell},
    {headerName: 'Opción 3', field: 'price3', cellEditor: 'numericEditor', valueFormatter: function(params) {return params.value;},  editable:true, width:this.width_cell},
    {headerName: 'Opción 4', field: 'price4', cellEditor: 'numericEditor', valueFormatter: function(params) {return params.value;},  editable:true, width:this.width_cell},
    {headerName: 'Opción 5', field: 'price5', cellEditor: 'numericEditor', valueFormatter: function(params) {return params.value;},  editable:true, width:this.width_cell},
    {headerName: 'Opción 6', field: 'price6', cellEditor: 'numericEditor', valueFormatter: function(params) {return params.value;},  editable:true, width:this.width_cell},
    {headerName: 'Opción 7', field: 'price7', cellEditor: 'numericEditor', valueFormatter: function(params) {return params.value;},  editable:true, width:this.width_cell},
    {headerName: 'Opción 8', field: 'price8', cellEditor: 'numericEditor', valueFormatter: function(params) {return params.value;},  editable:true, width:this.width_cell}
  ];

  rowData = [
    { age_range: '18-24', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
    { age_range: '25-29', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
    { age_range: '30-34', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
    { age_range: '35-39', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
    { age_range: '40-44', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
    { age_range: '45-49', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
    { age_range: '50-54', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
    { age_range: '55-59', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
    { age_range: '60-64', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
    { age_range: '65-69', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
    { age_range: '70-74', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
    { age_range: '75-79', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
    { age_range: '80+'  , price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },

    { age_range: '1 dependiente'  , price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
    { age_range: '2 dependientes'  , price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
    { age_range: '3+ dependientes'  , price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },

    { age_range: 'Deducible'  , price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },

  ];

  gridApi: any;
  gridColumnApi: any;
  arr: any = [];
  defaultColDef: { cellClass: string; resizable: boolean; };
  countries:any;
  formCountry: any = {country_id:0};
  arrPrices: Array<any> = [];
  selected_country_id: string;

  constructor(private planService: PlanService, private uploadService: UploadService ,private afStorage: AngularFireStorage, public datePipe:DatePipe, private http: Http, private completerService: CompleterService, private builder: FormBuilder, private _sanitizer: DomSanitizer, public companyService: CompanyService, public userService: UserService, public activatedRoute: ActivatedRoute, private navbarTitleService: NavbarTitleService, public router: Router, public authGuard: AuthGuard, public authService: AuthService,  public location: Location,  private notificationService: NotificationService) {
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

    this.headerRowPlan = ['Nombre', 'Descripción', 'ACCIONES'];
    this.data = [];
    this.formData = { description: '', logo:'', name:'', email: ''};
    this.formDataEdit = this.formCountry = { };
    this.downloadURL = '';
    // this.myFormCategory = this.builder.group({
    //   category : ['0', [Validators.required, Validators.minLength(3)]],
    // });


    //this.formData.categories.id_category = 1;
    this.showEditForm = this.showPlans = this.showNewForm = this.progress = false;
    this.getCompanies(this.search);
    this.defaultColDef = {
      cellClass: "number-cell",
      resizable: false
    };
    this.frameworkComponents = {
      numericEditor: NumericEditor
    };

    this.getCountries();
    //this.formCountry.country_id = 0;
    
  }

  NumericCellEditor(){
      alert()
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

  public onSuccessCompanies(response:any){
    this.progress = false;
  //this.data = response.json().filter(i => i.id_rol < '4'); 
  //this.data = this.data.filter(i => i.id_rol < '4') ;
    if(!response['Error'])
      this.data = response;
  }

  getCountries(){
    this.companyService.getCountries('').subscribe(
      (response) => {this.progress = false; this.countries = response;},
      (error) => { 
        this.showNotification('top', 'center', '<b>Error</b>', 'pe-7s-attention', 4); 
        this.progress=false; 
      }, 

    )
  }

  onSuccessNewCountry(response:any){
    this.progress = false;
    if(!response.Error){
      this.showNotification('top', 'center', '<b>País agregado</b>', 'pe-7s-check', 2);
      this.getCountries();
      }else{
        this.progress = false;
      this.showNotification('top', 'center', '<b>El nombre del país ya existe</b>', 'pe-7s-attention', 4);
      }
  }
  
  onErrorNewCountry(error:any){
    this.progress = false;
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
    this.formData ={
      description: '',logo:''
    };
    this.imageIsUpload = false;
  }

  
  public showPlansCompany(row){
    this.dataPlan = [];
    this.showNewForm = false;
    this.showEditForm = false;
    this.showPlans = true;
    this.companyName = row.name;
    this.company_id = row.company_id;
    this.companyService.getCompanyPlans(row.company_id).subscribe(
      data=>{
        //console.log(data);
        if(data['Error']) 
          this.dataPlan = [];
          else
          this.dataPlan = data;
      
          this.progress = false;
      }
    )
    
  }

  public newPlan(row:any){
    //console.log(this.company_id)
    this.showNewFormPlan = true;
    this.showPlans = false;
    this.titlePlan = 'Nuevo';
    this.formDataPlan = {
      company_id: this.company_id
    };

    this.countries.forEach(element => {

      this.rowData = [
        { age_range: '18-24', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
        { age_range: '25-29', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
        { age_range: '30-34', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
        { age_range: '35-39', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
        { age_range: '40-44', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
        { age_range: '45-49', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
        { age_range: '50-54', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
        { age_range: '55-59', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
        { age_range: '60-64', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
        { age_range: '65-69', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
        { age_range: '70-74', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
        { age_range: '75-79', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
        { age_range: '80+'  , price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
    
        { age_range: '1 dependiente'  , price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
        { age_range: '2 dependientes'  , price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
        { age_range: '3+ dependientes'  , price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
    
        { age_range: 'Deducible'  , price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
    
      ];

    this.arrPrices.push({country_id: element.country_id, table: this.rowData});
    });
    
    //console.log(this.formDataPlan.price)
    this.formDataPlan.price = this.arrPrices;
    //this.formDataPlan = row;
    this.formCountry.country_id = 0;
    this.rowData = [];
  }

  public editPlan(row:any){
    this.showNewFormPlan = true;
    this.showPlans = false;
    this.titlePlan = 'Editar';
    this.formDataPlan = row;
    //console.log(row.price);
    this.formCountry.country_id = 0;
    this.rowData = [];
    
  }

  getPriceByCountryId(id:string){
    return this.formDataPlan.price.filter((x: { country_id: string; }) => x.country_id === id)[0];
  }

  setPriceByCountryId(id:string){
    this.formDataPlan.price.filter(x => x.country_id === id)[0].table = this.getAllRows();
  }
  
  getSelectedCountryId(){
    return this.selected_country_id;
  }

  cellValueChanged(){
    this.setPriceByCountryId(this.formCountry.country_id);
  }

  onChangeCountry(){
    //console.log(this.getPriceByCountryId(id))
    if(this.formCountry.country_id=='0')
      this.rowData = [];
    else
      if(this.getPriceByCountryId(this.formCountry.country_id)) {
      this.rowData = this.getPriceByCountryId(this.formCountry.country_id).table;
    }else{
      this.rowData = [
        { age_range: '18-24', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
        { age_range: '25-29', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
        { age_range: '30-34', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
        { age_range: '35-39', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
        { age_range: '40-44', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
        { age_range: '45-49', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
        { age_range: '50-54', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
        { age_range: '55-59', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
        { age_range: '60-64', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
        { age_range: '65-69', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
        { age_range: '70-74', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
        { age_range: '75-79', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
        { age_range: '80+'  , price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
    
        { age_range: '1 dependiente'  , price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
        { age_range: '2 dependientes'  , price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
        { age_range: '3+ dependientes'  , price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
    
        { age_range: 'Deducible'  , price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
    
      ];
      this.arrPrices.push({country_id: this.formCountry.country_id, table: this.rowData});
      this.formDataPlan.price = this.arrPrices;
    }
   
  }
  

  public deletePlan(row){

    this.progress=true;
    this.planService.deletePlan(row.plan_id).subscribe(
        (response) => this.onSuccessDeletePlan(response), 
        (error) => this.onErrorDelete(error), 
      );
  }

  onSuccessDeletePlan(response:any){
    this.progress = false;
    if(!response.Error){
      this.showNotification('top', 'center', '<b>Plan eliminado</b>', 'pe-7s-check', 2);
      this.showPlansCompany({name: this.companyName, company_id: this.company_id});
      this.showNewFormPlan = false;
      }else{
        this.showNewForm = false;
        this.showEditForm = false;
        this.showPlans = false;
        this.showNewFormPlan = true;
      this.showNotification('top', 'center', '<b>Error eliminando</b>', 'pe-7s-attention', 4);
      }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  getAllRows() {
    let rowData =[];
    this.gridApi.forEachNode((node: { data: any; }) => rowData.push(node.data));
    return rowData;
  }



  public onSubmitPlan(){
    this.progress=true;

    console.log('Submitting values', this.formDataPlan);
    
    if(this.titlePlan == 'Nuevo')
     this.planService.postPlan(this.formDataPlan).subscribe(
        (response) => this.onSuccessPlan(response), 
        (error) => this.onErrorPlan(error), 
      );
    else
      this.planService.putPlan(this.formDataPlan).subscribe(
        (response) => this.onSuccessPlan(response), 
        (error) => this.onErrorPlan(error), 
      );

  }

  onSuccessPlan(response:any){
    this.progress = false;
    this.showPlans = true;
    
    if(!response.Error){
      this.showNotification('top', 'center', '<b>Plan agregado correctamente</b>', 'pe-7s-check', 2);
      this.showPlansCompany({name:this.companyName, company_id:this.company_id});
      this.showNewFormPlan = false;
      }else{
        this.progress = false;
        this.showNewForm = false;
        this.showEditForm = false;
        this.showPlans = false;
        this.showNewFormPlan = true;
      this.showNotification('top', 'center', '<b>El nombre del plan ya existe</b>', 'pe-7s-attention', 4);
      }
  }

  onErrorPlan(response:any){
    this.progress = false;
    this.showNewForm = false;
    this.showEditForm = false;
    this.showPlans = false;
    this.showNewFormPlan = true;
    this.showNotification('top', 'center', '<b>Error</b>', 'pe-7s-attention', 4);
  }

  public editCompany(row:any){
    this.showEditForm = true;
    this.formData = row;
    this.downloadURL = '';
    this.imageIsUpload = true;
    //this.formData.company_id = row.company_id;
    //console.log(this.formData)
    //this.formData.url = row.url;
  }



  public cancel(){
    //console.log(this.formData);
    this.formData = {description:''};
    this.ngOnInit();
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
    //this.uploadFileFirebase();

    //console.log('Submitting values', this.formData);
      
     this.companyService.postCompany(this.formData).subscribe(
        (response) => this.onSuccessNewCompany(response), 
        (error) => this.onErrorNewCompany(error), 
      );

  }

  onSuccessNewCompany(response){
    if(!response.Error){
    this.showNotification('top', 'center', '<b>Aseguradora creada</b>', 'pe-7s-check', 2);
    this.ngOnInit();
    }else{
    this.progress = false;
    this.showNewForm = true;
    this.showEditForm = false;  
    this.showNotification('top', 'center', '<b>Email registrado en otra aseguradora</b>', 'pe-7s-attention', 4);
    }
    
  }

  onErrorNewCompany(error){
    this.progress = false;
    this.showNewForm = true;
    this.showEditForm = false;

    this.showNotification('top', 'center', '<b>Error</b>', 'pe-7s-attention', 4);
    console.log(error);   
  }


  public onSubmitEditCompany(){
    this.progress=true;
    if(this.file)
      this.uploadFileFirebase();
    //this.formData.date_finish = this.datePipe.transform(this.formData.date_finish.jsdate, 'yyyy-MM-dd');
    console.log('Submitting values edit', this.formData);
     this.companyService.putCompany(this.formData).subscribe(
        (response) => this.onSuccessUpdate(response), 
        (error) => this.onErrorUpdate(error), 
      );
  }

  onSuccessUpdate(response){
    if(!response.Error){
    this.showNotification('top', 'center', '<b>Actualizada correctamente</b>', 'pe-7s-check', 2);
    this.ngOnInit();
    }else{
      this.progress = false;
      this.showNewForm = false;
      this.showEditForm = true;  
      this.showNotification('top', 'center', '<b>Email registrado en otra aseguradora</b>', 'pe-7s-attention', 4);
      }
  }

  onErrorUpdate(error){
    this.progress = false;
    this.showEditForm = true;
    this.showNewForm = false;
    this.showNotification('top', 'center', '<b>Error</b>', 'pe-7s-attention', 4);
    console.log(error);  
  }

  public changeStatus(row:any){

    this.progress=true;
    this.companyService.putStatus(row.company_id).subscribe(
        (response) => this.onSuccessStatus(response), 
        (error) => this.onErrorStatus(error), 
        () => this.onCompleteStatus()
      );
 
  }

  public changeStatusPlan(row:any){

    this.progress=true;
    this.planService.putStatus(row.plan_id).subscribe(
        (response) => {
          this.onSuccessStatus(response);
          this.showPlansCompany({name:this.companyName, company_id:this.company_id});
        }, 
        (error) => this.onErrorStatus(error), 
        //() => this.onCompleteStatus()
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


    public deleteCompany(row){

    this.progress=true;
    this.companyService.deleteCompany(row.company_id).subscribe(
        (response) => this.onSuccessDelete(response), 
        (error) => this.onErrorDelete(error), 
      );
 
  }

  onSuccessDelete(response){
    this.progress = false;
    if(!response.Error){
    this.showNotification('top', 'center', '<b>Eliminada correctamente</b>', 'pe-7s-check', 2);
    this.ngOnInit();
    }
    else
    this.showNotification('top', 'center', '<b>Error</b>', 'pe-7s-attention', 4);
    //console.log(response);
  }

  onErrorDelete(error){
    this.progress = false;
    this.showNotification('top', 'center', '<b>Error</b>', 'pe-7s-attention', 4);
    //console.log(error.message);   
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

  detectFiles(event:any, new_file:boolean) {
    this.file = event.target.files[0];
    this.imageIsUpload = true;
    //if(new_file)
      this.uploadFileFirebase()
  }


  uploadFileFirebase(){
    this.imageIsUpload = false;
    let ref = this.uploadService.refCloudStorage('companies/logos');
    let task = this.uploadService.taskCloudStorage('companies/logos', this.file);
    //Cambia el porcentaje
    task.percentageChanges().subscribe((porcentaje) => {
      this.uploadProgress = Math.round(porcentaje);
      //console.log(this.uploadProgress)
      if (this.uploadProgress == 100) {
        this.imageIsUpload = true;
      }
    });

  
      ref.getDownloadURL().subscribe((URL) => {
        this.downloadURL = URL;
        this.formData.logo = URL;
        if(this.formData.company_id)
        this.companyService.putLogoUrl(this.downloadURL, this.formData.company_id).subscribe(
          data => {
            console.log(data)
            //this.uploadProgress = false;
          }
        )
  
      });

  }


  imageRemoved($event){
    this.imageIsUpload = false;
    this.downloadURL = this.formData.logo;
    //alert()
  }

isUrlValid(userInput) {
    var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if(res == null)
        return false;
    else
        return true;
}

}