import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import { Location, DatePipe } from '@angular/common';
import { NavbarTitleService } from '../lbd/services/navbar-title.service';
import {  Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

import { AuthGuard } from '../services/auth-guard.service';
import { NotificationService, NotificationType, NotificationOptions } from '../lbd/services/notification.service';
import * as vars from '../config';
import { BsModalComponent } from 'ng2-bs3-modal';

import { BsModalRef, BsModalService} from 'ngx-bootstrap/modal'
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { CompleterService, } from 'ng2-completer';
import { Http, } from '@angular/http';
import { CustomData } from "../services/custom-data";



import { trigger, state, transition, style, animate } from '@angular/animations';
import { CompanyService } from '../services/company.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { UploadService } from '../services/upload.service';
import { PlanService } from '../services/plan.service';
import { AgGridAngular } from 'ag-grid-angular';

import { NumericEditor } from '../numeric-editor.component';

// import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { IDropdownSettings } from 'ng-multiselect-dropdown';

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
  public companies:Array<any> = [];
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
  formDataPlanCopy: any = {};

  headerRowPlan: string[];

  public disabled: boolean = false;
  public disabledSubCategory: boolean = false;
  public busy: boolean = false;
  public q : string = '';
  public name: string;
  public customData: CustomData;

  public search:string ='';
  file: File;
  fileComp: File;

  imageIsUpload:boolean = true;
  newPic:boolean = false;
  downloadURL:string;
  downloadURLComp:string;
  uploadProgress:number;
  uploadProgressComp:number;
  prices = [0, 0, 0];
  titlePlan:string='';
  company_id: any;
  width_cell: number = 118;
  @ViewChild('agGrid', {static:true}) agGrid: AgGridAngular;
  public frameworkComponents;
  typeTable: boolean = false;
  @ViewChild('modal', {static:true})
  modal: BsModalComponent;

  statusCountry = true;

  // agesTable = [
  //   { age_range: '18-24', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
  //   { age_range: '25-29', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
  //   { age_range: '30-34', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
  //   { age_range: '35-39', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
  //   { age_range: '40-44', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
  //   { age_range: '45-49', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
  //   { age_range: '50-54', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
  //   { age_range: '55-59', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
  //   { age_range: '60-64', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
  //   { age_range: '65-69', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
  //   { age_range: '70-74', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
  //   { age_range: '75-79', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
  //   { age_range: '80+'  , price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 },
  // ];

  columnDefs = [
    // {headerName: 'Edad',     field: 'age_range', editable:false, width:150},
    // {headerName: 'Opción 1', field: 'price1', cellEditor: 'numericEditor', valueFormatter: function(params) {return (params.value);},  editable:true, width:this.width_cell},
    // {headerName: 'Opción 2', field: 'price2', cellEditor: 'numericEditor', valueFormatter: function(params) {return params.value;},  editable:true, width:this.width_cell},
    // {headerName: 'Opción 3', field: 'price3', cellEditor: 'numericEditor', valueFormatter: function(params) {return params.value;},  editable:true, width:this.width_cell},
    // {headerName: 'Opción 4', field: 'price4', cellEditor: 'numericEditor', valueFormatter: function(params) {return params.value;},  editable:true, width:this.width_cell},
    // {headerName: 'Opción 5', field: 'price5', cellEditor: 'numericEditor', valueFormatter: function(params) {return params.value;},  editable:true, width:this.width_cell},
    // {headerName: 'Opción 6', field: 'price6', cellEditor: 'numericEditor', valueFormatter: function(params) {return params.value;},  editable:true, width:this.width_cell},
    // {headerName: 'Opción 7', field: 'price7', cellEditor: 'numericEditor', valueFormatter: function(params) {return params.value;},  editable:true, width:this.width_cell},
    // {headerName: 'Opción 8', field: 'price8', cellEditor: 'numericEditor', valueFormatter: function(params) {return params.value;},  editable:true, width:this.width_cell}
  ];

  rowData = [
    // this.createRange(),
  ];


  gridApi: any;
  gridColumnApi: any;
  arr: any = [];
  defaultColDef: { cellClass: string; resizable: boolean; };
  countries:any;
  formCountry: any = {country_id:0, status: true};
  arrPrices: Array<any> = [];
  selected_country_id: string;
  myGroup: FormGroup;
  // maternityControl: FormControl;
  modalRef: BsModalRef;

  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};

  constructor(
    private modalService: BsModalService,
    private planService: PlanService, private uploadService: UploadService ,private afStorage: AngularFireStorage, public datePipe:DatePipe, private http: Http, private completerService: CompleterService, private builder: FormBuilder, private _sanitizer: DomSanitizer, public companyService: CompanyService, public userService: UserService, public activatedRoute: ActivatedRoute, private navbarTitleService: NavbarTitleService, public router: Router, public authGuard: AuthGuard, public authService: AuthService,  public location: Location,  private notificationService: NotificationService) {
    this.customData = new CustomData(userService, http); 
    this.myGroup = builder.group({
      'maternityControl': ['', Validators.compose([Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(4)])],
      'maternityDeduControl': [],
      'transplantControl': ['', Validators.compose([Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(4)])],
      'costAdminControl': ['', Validators.compose([Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(4)])]
    });
    this.columnDefs = [
      {headerName: 'Edad',     field: 'age_range', editable:false, width:130},
      {headerName: 'Opción 1', field: 'price1', cellEditor: 'numericEditor', valueFormatter: function(params) { 
        return Math.floor(params.value).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      }, editable:true, width:this.width_cell},
      {headerName: 'Opción 2', field: 'price2', cellEditor: 'numericEditor', valueFormatter: function(params) { 
          return Math.floor(params.value).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      }, editable:true, width:this.width_cell},
      {headerName: 'Opción 3', field: 'price3', cellEditor: 'numericEditor', valueFormatter: function(params) { 
        return Math.floor(params.value).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      }, editable:true, width:this.width_cell},
      {headerName: 'Opción 4', field: 'price4', cellEditor: 'numericEditor', valueFormatter: function(params) { 
        return Math.floor(params.value).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      },  editable:true, width:this.width_cell},
      {headerName: 'Opción 5', field: 'price5', cellEditor: 'numericEditor', valueFormatter: function(params) { 
        return Math.floor(params.value).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      },  editable:true, width:this.width_cell},
      {headerName: 'Opción 6', field: 'price6', cellEditor: 'numericEditor', valueFormatter: function(params) { 
        return Math.floor(params.value).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      },  editable:true, width:this.width_cell},
      {headerName: 'Opción 7', field: 'price7', cellEditor: 'numericEditor', valueFormatter: function(params) { 
        return Math.floor(params.value).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      },  editable:true, width:this.width_cell},
      {headerName: 'Opción 8', field: 'price8', cellEditor: 'numericEditor', valueFormatter: function(params) { 
        return Math.floor(params.value).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      },  editable:true, width:this.width_cell}
    ];
   
  }

  ngOnInit() {
   
    this.arrPrices = [];
    this.formDataPlan.price = [];

    this.navbarTitleService.updateTitle('Aseguradoras');
    this.tableData = {
    headerRow: ['Nombre', 'Email', 'Descripción', 'Órden', 'ACCIONES'],
    };

    this.headerRowPlan = ['Nombre', 'Descripción', 'Órden', 'ACCIONES'];
    this.companies = [];
    this.formData = { description: '', logo:'', name:'', email: '', comparative:''};
    this.formDataEdit = this.formCountry = { };
    this.downloadURL = '';

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

    this.dropdownList = [
      { item_id: 1, item_text: 'Opción I' },
      { item_id: 2, item_text: 'Opción II' },
      { item_id: 3, item_text: 'Opción III' },
      { item_id: 4, item_text: 'Opción IV' },
      { item_id: 5, item_text: 'Opción V' },
      { item_id: 6, item_text: 'Opción VI' },
      { item_id: 7, item_text: 'Opción VII' },
      { item_id: 8, item_text: 'Opción VIII' }
    ];
    this.selectedItems = [
      // { item_id: 3, item_text: 'Pune' },
      // { item_id: 4, item_text: 'Navsari' }
    ];

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      enableCheckAll: false,
      selectAllText: 'Seleccionar Todos',
      unSelectAllText: 'Quitar Todos',
      itemsShowLimit: 2,
      allowSearchFilter: false,
    };

  }

  onItemSelect(item: any) {
    console.log('onItemSelect', item);
  }
  onSelectAll(items: any) {
    console.log('onSelectAll', items);
  }

  public getCompanies(q:string){
    this.progress = true;
    //console.log(this.rols);
    this.companyService.getCompanies(q).subscribe(
        (response) => this.onSuccessCompanies (response),
        (error) => { 
          this.showNotification('top', 'center', '<b>Error</b>', 'pe-7s-attention', 4); 
          this.companies = []; 
          console.log(error.json()); 
          this.progress=false; 
        }, 
        //() => this.onCompleteLogin()
    );
  }

  public onSuccessCompanies(response:any){
    this.progress = false;
    if(!response['Error'])
      this.companies = response;
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
      description: '',logo:'', comparative:''
    };
    this.imageIsUpload = false;
  }

  
  public showPlansCompany(row){
    this.dataPlan = [];
    this.progress = true;
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
    );
    
  }

  public newPlan(row:any){
    //console.log(this.company_id)
    this.showNewFormPlan = true;
    this.downloadURLComp = '';
    this.showPlans = false;
    this.titlePlan = 'Nuevo';
    this.formDataPlan = {
      company_id: this.company_id,
      description: '' 
    };

    this.countries.forEach(element => {
      this.rowData = this.createRange();
      this.arrPrices.push({country_id: element.country_id, table: this.rowData});
    });
    
    //console.log(this.formDataPlan.price)
    this.formDataPlan.price = this.arrPrices;
    //this.formDataPlan = row;
    this.formCountry.country_id = 0;
    this.statusCountry = true;
    this.rowData = [];

    this.myGroup.controls['maternityControl'].setValue(0);
    this.myGroup.controls['transplantControl'].setValue(0);
    this.myGroup.controls['costAdminControl'].setValue(0);

    // this.selectedItems  = this.dropdownList;
    this.myGroup.controls['maternityDeduControl'].setValue([]);
  }

  public editPlan(row:any){
    this.showNewFormPlan = true;
    this.downloadURLComp = '';
    this.showPlans = false;
    this.titlePlan = 'Editar';
    // console.log(row.maternity_deductible);
    this.myGroup.controls['maternityControl'].setValue(row.maternity);
    this.myGroup.controls['maternityDeduControl'].setValue(row.maternity_deductible ? row.maternity_deductible: []);
    this.myGroup.controls['transplantControl'].setValue(row.transplant);
    this.myGroup.controls['costAdminControl'].setValue(row.cost_admin);
    this.formDataPlan = row;
    // this.formDataPlanCopy = row;
    this.arrPrices = [];
    //console.log(row.price);
    // let copy = row.price;

    this.countries.forEach(element => {

      if(this.getPriceByCountryId(element.country_id)){
        this.rowData = this.getPriceByCountryId(element.country_id).table;
        this.statusCountry = this.getPriceByCountryId(element.country_id).status !== undefined ? 
        this.getPriceByCountryId(element.country_id).status : true;
      }else{
        this.rowData =  this.createRange();
        this.statusCountry = true;
      }
      this.arrPrices.push({country_id: element.country_id, table: this.rowData, status: this.statusCountry});
    });
    
    //console.log(this.formDataPlan.price)
    this.formDataPlan.price = this.arrPrices;


    this.formCountry.country_id = 0;
    this.formCountry.status = true;
    this.rowData = [];
    
  }

  getPriceByCountryId(id:string){
    // console.log(this.formDataPlan.price.filter((x: { country_id: string; }) => x.country_id === id))
    return this.formDataPlan.price.filter((x: { country_id: string; }) => x.country_id === id)[0];
  }

  setPriceByCountryId(id:string){
    // console.log(this.formDataPlan.price.filter(x => x.country_id === id))
    this.formDataPlan.price.filter(x => x.country_id === id)[0].table = this.getAllRows();
  }

  setStatusCountry(id:string){
    // console.log(this.formDataPlan.price.filter(x => x.country_id === id))
    this.formDataPlan.price.filter(x => x.country_id === id)[0].status = this.statusCountry;
  }
   
  getSelectedCountryId(){
    return this.selected_country_id;
  }

  cellValueChanged(){
    this.setPriceByCountryId(this.formCountry.country_id);
  }

  // createRangeAges(){
  //   var itemsAges: any[] = [];
  //   for (let i = 0; i <= 99; i++) {
  //     // console.log ("Block statement execution no." + i);
  //     itemsAges.push({ age_range: i.toString(), price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 });

  //   }
  //   itemsAges.push({ age_range: '1 dependiente'  , price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 });
  //   itemsAges.push({ age_range: '2 dependientes'  , price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 });
  //   itemsAges.push({ age_range: '3+ dependientes'  , price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 });
  //   itemsAges.push({ age_range: 'Deducible'  , price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 });
  //   console.log(itemsAges);
  //   return itemsAges;

  // }

  createRange(){
    var items: any[] = [];
    if(!this.typeTable){
      items.push( { age_range: '18-24', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 });
      items.push( { age_range: '25-29', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 });
      items.push( { age_range: '30-34', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 });
      items.push( { age_range: '35-39', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 });
      items.push( { age_range: '40-44', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 });
      items.push( { age_range: '45-49', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 });
      items.push( { age_range: '50-54', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 });
      items.push( { age_range: '55-59', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 });
      items.push( { age_range: '60-64', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 });
      items.push( { age_range: '65-69', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 });
      items.push( { age_range: '70-74', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 });
      items.push( { age_range: '75-79', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 });
      items.push( { age_range: '80+', price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 });
      items.push({ age_range: '1 dependiente'  , price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 });
      items.push({ age_range: '2 dependientes'  , price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 });
      items.push({ age_range: '3+ dependientes'  , price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 });
      items.push({ age_range: 'Deducible'  , price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 });
    }
    // var itemsAges: any[] = [];
    else{
      for (let i = 0; i <= 99; i++) {
        // console.log ("Block statement execution no." + i);
        items.push({ age_range: i.toString(), price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 });
      }
      items.push({ age_range: '1 dependiente'  , price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 });
      items.push({ age_range: '2 dependientes'  , price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 });
      items.push({ age_range: '3+ dependientes'  , price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 });
      items.push({ age_range: 'Deducible'  , price1: 0, price2: 0, price3: 0, price4: 0, price5: 0, price6: 0, price7: 0, price8: 0 });
    }

    return items;

  }

  openModal(template: TemplateRef<any>, typeTable) {
    // console.log(typeTable);
    // this.typeTable = typeTable;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }
 
  confirm(typeTable): void {
    // this.message = 'Confirmed!';
    this.rowData = this.createRange()
    this.modalRef.hide();
  }
 
  decline(typeTable): void {
    console.log('Declined!',typeTable);
    if(this.getPriceByCountryId(this.formCountry.country_id)) {
      this.rowData = this.getPriceByCountryId(this.formCountry.country_id).table;
    }

    if(this.rowData.length > 17) this.typeTable = true; else this.typeTable = false;
  
    this.modalRef.hide();
  }

  onChangeCountry(){
    console.log((this.formCountry.country_id));

    if(this.formCountry.country_id=='0')
      this.rowData = [];
    else
      if(this.getPriceByCountryId(this.formCountry.country_id)) {
        this.rowData = this.getPriceByCountryId(this.formCountry.country_id).table;
        // console.log(this.getPriceByCountryId(this.formCountry.country_id))
        this.statusCountry = this.getPriceByCountryId(this.formCountry.country_id).status !== undefined ? 
        this.getPriceByCountryId(this.formCountry.country_id).status: true;
        // console.log(this.statusCountry)
        // console.log(this.rowData.length)
        if(this.rowData.length > 17) this.typeTable = true; else this.typeTable = false;
    }else{
        console.log('no data');
        this.rowData = this.createRange();
        // console.log(this.formDataPlan.price)
        // this.formDataPlan.price.filter(x => x.country_id === this.formCountry.id)[0].table = this.getAllRows();

        // this.arrPrices.push({country_id: this.formCountry.country_id, table: this.rowData});
        // this.formDataPlan.price = this.arrPrices;
    }
   
  }

  resetPrice(){
    this.countries.forEach(element => {
      this.rowData =  this.createRange();
      this.arrPrices.push({country_id: element.country_id, table: this.rowData});
    });
    //console.log(this.formDataPlan.price)
    this.formDataPlan.price = this.arrPrices;
    this.planService.putPlan(this.formDataPlan).subscribe(
      (response) => this.onSuccessPlan(response), 
      (error) => this.onErrorPlan(error), 
    );
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
    window.scroll(0,0);
    this.progress=true;
    this.formDataPlan.maternity = this.myGroup.controls['maternityControl'].value;
    this.formDataPlan.maternity_deductible = this.myGroup.controls['maternityDeduControl'].value;
    this.formDataPlan.transplant = this.myGroup.controls['transplantControl'].value;
    this.formDataPlan.cost_admin = this.myGroup.controls['costAdminControl'].value;
    
    if(!this.formDataPlan.comparative) this.formDataPlan.comparative = '';
    if(!this.formDataPlan.url_info) this.formDataPlan.url_info = '';

    if(this.fileComp)
      this.uploadFileFirebaseComp();

    console.log('Submitting values', this.formDataPlan);
    this.typeTable = false;

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
      this.showNotification('top', 'center', '<b>Plan guardado correctamente</b>', 'pe-7s-check', 2);
      this.showPlansCompany({name:this.companyName, company_id:this.company_id});
      this.showNewFormPlan = false;
      // this.formDataPlan = [];
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
    // this.formData = { description: '', logo:'', name:'', email: '', comparative:''};
    // console.log(this.formData);
    this.showEditForm = true;
    this.formData = row;
    this.downloadURL = '';
    this.downloadURLComp = '';
    this.imageIsUpload = true;
    // console.log(this.formData);
    // if(row.description!='')
    // this.formData.description = row.description;
    // else
    // this.formData.description = ' '; 
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

  public cancelPlans(){
    //console.log(this.formData);
    this.downloadURLComp = '';
    this.showPlansCompany({name:this.companyName, company_id:this.company_id});
    // this.ngOnInit();
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
    // if(this.fileComp)
      // this.uploadFileFirebaseComp();
    //this.formData.date_finish = this.datePipe.transform(this.formData.date_finish.jsdate, 'yyyy-MM-dd');
    if(!this.formData.description) this.formData.description = '';
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

  
  public changeStatusCountry(id:string){
    // console.log(this.formCountry)
    // this.formCountry.status = !this.formCountry.status;
    // this.getPriceByCountryId(this.formCountry.country_id).status ? 
    // this.setStatusCountry(this.formCountry.country_id) : true;
    this.setStatusCountry(id);

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
      this.uploadFileFirebase();
  }

  detectFilesComp(event:any, new_file:boolean) {
    this.fileComp = event.target.files[0];
    this.imageIsUpload = true;
    //if(new_file)
      this.uploadFileFirebaseCompPlan();
  }


  uploadFileFirebase(){
    //console.log(company_id);
    this.imageIsUpload = false;
    let ref = this.uploadService.refCloudStorage('companies/logos/'+this.formData.company_id+'/');
    let task = this.uploadService.taskCloudStorage('companies/logos/'+this.formData.company_id+'/', this.file);
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

  uploadFileFirebaseComp(){
    //console.log(company_id);
    this.imageIsUpload = false;
    let refComp = this.uploadService.refCloudStorage('companies/comparative/'+this.formData.company_id+'/');
    let taskComp = this.uploadService.taskCloudStorage('companies/comparative/'+this.formData.company_id+'/', this.fileComp);
    //Cambia el porcentaje
    taskComp.percentageChanges().subscribe((porcentaje) => {
      this.uploadProgressComp = Math.round(porcentaje);
      //console.log(this.uploadProgress)
      if (this.uploadProgressComp == 100) {
        this.imageIsUpload = true;
      }
    });

  
      refComp.getDownloadURL().subscribe((URL) => {
        this.downloadURLComp = URL;
        this.formData.comparative = URL;
        if(this.formData.company_id)
        this.companyService.putComparativeUrl(this.downloadURLComp, this.formData.company_id).subscribe(
          data => {
            console.log(data)
            //this.uploadProgress = false;
          }
        )
  
      });

  }


  
  uploadFileFirebaseCompPlan(){
    //console.log(company_id);
    this.imageIsUpload = false;
    let refComp = this.uploadService.refCloudStorage('companies/plan/'+this.formDataPlan.plan_id+'/');
    let taskComp = this.uploadService.taskCloudStorage('companies/plan/'+this.formDataPlan.plan_id+'/', this.fileComp);
    //Cambia el porcentaje
    taskComp.percentageChanges().subscribe((porcentaje) => {
      this.uploadProgressComp = Math.round(porcentaje);
      //console.log(this.uploadProgress)
      if (this.uploadProgressComp == 100) {
        this.imageIsUpload = true;
      }
    });

    setTimeout(() => {
      
      refComp.getDownloadURL().subscribe((URL) => {
        this.downloadURLComp = URL;
        this.formDataPlan.comparative = URL;
        if(this.formDataPlan.plan_id)
        this.companyService.putComparativePlanUrl(this.downloadURLComp, this.formDataPlan.plan_id).subscribe(
          data => {
            console.log(data)
            //this.uploadProgress = false;
          }
        )
  
      });

    }, 1000);

  }


  imageRemoved($event){
    this.imageIsUpload = false;
    this.downloadURL = this.formData.logo;
    //alert()
  }

  imageRemovedComp($event){
    this.imageIsUpload = true;
    // if(this.formDataPlan.comparative!='')
    // this.downloadURLComp = this.formDataPlan.comparative;
    // else
    this.formDataPlan.comparative = '';
    this.downloadURLComp = '';
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
