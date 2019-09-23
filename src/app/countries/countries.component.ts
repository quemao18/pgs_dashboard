import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../services/company.service';
import { NotificationService, NotificationType, NotificationOptions } from '../lbd/services/notification.service';
import { trigger, state, transition, style, animate } from '@angular/animations';
import * as vars from '../config';
import { NavbarTitleService } from '../lbd/services/navbar-title.service';


@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss'],
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
export class CountriesComponent implements OnInit {

  progress: boolean = false;
  formCountry: any = {};
  countries: any = [];
  title: string = "Agregar";
  showNewForm: boolean = false;
  page:number = 1;
  pagination: number = vars.pagination;
  headerRowPlan = [];

  constructor(private companyService: CompanyService, private notificationService: NotificationService, private navbarTitleService: NavbarTitleService) { }

  ngOnInit() {
    this.getCountries('');
    this.title = "Agregar";
    this.headerRowPlan = ['Nombre', 'ACCIONES'];
    this.navbarTitleService.updateTitle('País/Región');

  }

  
  public newCountry(){
    this.showNewForm = true;
    this.title = 'Nuevo';
    this.formCountry = {};
  }

  public editCountry(row:any){
    this.showNewForm = true;
    this.title = 'Editar';
    this.formCountry = row;
  }

  public deleteCountry(row:any){
    this.title = 'Editar';
    this.progress=true;
    this.companyService.deleteCountry(row.country_id).subscribe(
        (response) => this.onSuccessDelete(response), 
        (error) => this.onErrorDelete(), 
      );
  }

  onSuccessDelete(response:any){
    this.progress = false;
    if(!response.Error){
      this.showNotification('top', 'center', '<b>País/Región eliminado</b>', 'pe-7s-check', 2);
      this.getCountries('');
      }else{
      this.showNotification('top', 'center', '<b>Error eliminando</b>', 'pe-7s-attention', 4);
      }
  }

  onErrorDelete(){
    this.progress = false;
    this.showNotification('top', 'center', '<b>Error</b>', 'pe-7s-attention', 4);
    //console.log(error.message);   
  }

  saveCountry(){
    this.progress = true;
    if(this.title=='Nuevo')
    this.companyService.postCountry(this.formCountry).subscribe(
        (response) => this.onSuccessNewCountry(response), 
        (error) => this.onErrorNewCountry(error), 
        //() => this.onCompleteNewModule()
      );
    else
    this.companyService.putCountry(this.formCountry).subscribe(
      (response) => this.onSuccessNewCountry(response), 
      (error) => this.onErrorNewCountry(error), 
      //() => this.onCompleteNewModule()
    );
  }

  
  public changeStatus(row:any){

    this.progress=true;
    this.companyService.putStatusCountry(row.country_id).subscribe(
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

  getCountries(term:string){
    this.progress = true;
    this.companyService.getCountries(term).subscribe(
      (response) => {
        this.progress = false; 
        if(!response['Error'])
        this.countries = response;
      },
      (error) => { 
        this.showNotification('top', 'center', '<b>Error</b>', 'pe-7s-attention', 4); 
        this.progress=false; 
      }, 

    )
  }

  onSuccessNewCountry(response:any){
    this.progress = false;
    if(!response.Error){
      if(this.title == 'Nuevo')
      this.showNotification('top', 'center', '<b>País agregado</b>', 'pe-7s-check', 2);
      else
      this.showNotification('top', 'center', '<b>País editado</b>', 'pe-7s-check', 2);
      this.getCountries('');
      this.showNewForm = false;
      }else{
        this.progress = false;
      this.showNotification('top', 'center', '<b>El nombre del país ya existe</b>', 'pe-7s-attention', 4);
      }
  }
  
  onErrorNewCountry(error:any){
    this.progress = false;
  }

  cancel(){
    this.title = 'Agregar';
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
