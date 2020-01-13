import {Component, OnInit, ViewChild, QueryList, ViewChildren, AfterViewInit} from '@angular/core';
// import { LegendItem, ChartType, LbdChartComponent, } from '../lbd/lbd-chart/lbd-chart.component';
import { Task } from '../lbd/lbd-task-list/lbd-task-list.component';
import { NavbarTitleService } from '../lbd/services/navbar-title.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { MediaService } from '../services/media.service';
import { AuthGuard } from '../services/auth-guard.service';
import { NotificationService, NotificationType, NotificationOptions } from '../lbd/services/notification.service';
import * as vars from '../config';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { CompanyService } from '../services/company.service';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Label, Color, BaseChartDirective } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import * as moment from 'moment';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  animations: [
    trigger('cardemail', [
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
    trigger('carduser', [
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
    trigger('card2014sales', [
      state('*', style({
        transform: 'translate3D(0px, 0px, 0px)',
        opacity: 1})),
      transition('void => *', [
        style({opacity: 0,
          transform: 'translate3D(0px, 150px, 0px)',
        }),
        animate('0.3s 0.5s ease-out')
      ])
    ]),
    trigger('cardtasks', [
      state('*', style({
        transform: 'translate3D(0px, 0px, 0px)',
        opacity: 1})),
      transition('void => *', [
        style({opacity: 0,
          transform: 'translate3D(0px, 150px, 0px)',
        }),
        animate('0.3s 0.75s ease-out')
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  public regionsChartType: ChartType;
  public regionsChartData: any;
  // public regionsChartLegendItems: LegendItem[];

  public hoursChartType: ChartType;
  public hoursChartData: any;
  public hoursChartOptions: any;
  public hoursChartResponsive: any[];
  // public hoursChartLegendItems: LegendItem[];

  public activityChartType: ChartType;
  public activityChartData: any;
  public activityChartOptions: any;
  public activityChartResponsive: any[];
  // public activityChartLegendItems: LegendItem[];

  public tasks: Task[];

  private countries:any;
  private companies:any;
  dataUsersPie:any;
  dataUsersLine:any;
  dataUsersBar:any;
  dataPlan:any;
  progressPie:boolean = false;
  progressLine:boolean = false;
  progressBar:boolean = false;
  public titlePie = 'Regiones más cotizadas';
  public subTitlePie = 'Cantidad de usuarios por región'

  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
      labels: {
        fontColor: 'black'
      }
    },
    plugins: {
      datalabels: {
        color: 'white',
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };

  public pieChartLabels: Label[] = [];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
    },
  ];
  public footerIconClassPie ='fa fa-refresh';
  public footerTextPie ='Actualizar';


  public titleLine = 'Usuarios nuevos';
  public subTitleLine = 'Cantidad de usuarios por mes'

  public lineChartData: ChartDataSets[] = [
    { data: [], label: '' },
  ];
  public lineChartLabels: Label[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
          ticks:{
            stepSize:1
          }
        },
        
        // {
        //   id: 'y-axis-1',
        //   position: 'right',
        //   gridLines: {
        //     color: 'rgba(255,0,0,0.3)',
        //   },
        //   ticks: {
        //     fontColor: 'red',
        //   }
        // }
      ]
    },
    annotation: {
      annotations: [
        // {
        //   type: 'line',
        //   mode: 'vertical',
        //   scaleID: 'x-axis-0',
        //   value: 'March',
        //   borderColor: 'orange',
        //   borderWidth: 2,
        //   label: {
        //     enabled: true,
        //     fontColor: 'orange',
        //     content: 'LineAnno'
        //   }
        // },
      ],
    },
  };
  public lineChartColors: Color[] = [
    { // blue
      backgroundColor: 'rgba(0,0,255,0.3)',
      borderColor: 'blue',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // magenta
      backgroundColor: 'rgba(255,0,255,0.2)',
      borderColor: 'magenta',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },

  ];
    public lineChartLegend = true;
    public lineChartType = 'line';
    public lineChartPlugins = [pluginAnnotations];

    // @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;
    // @ViewChildren(BaseChartDirective) charts: QueryList<BaseChartDirective>;
    public titleBar = 'Planes más cotizados';
    public subTitleBar = 'Cantidad de planes cotizados por aseguradora'
    public barChartOptions: ChartOptions = {
      responsive: true,
      // We use these empty structures as placeholders for dynamic theming.
      scales: { xAxes: [{}], yAxes: [{}] },
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'end',
        }
      }
    };
    public barChartLabels: Label[] = [];
    public barChartType: ChartType = 'bar';
    public barChartLegend = true;
    public barChartPlugins = [pluginDataLabels];

    public barChartData: ChartDataSets[] = [
      { data: [], label: '' },
      { data: [], label: '' },  
  ];


  constructor(
    // private chart: LbdChartComponent,
    private companyService: CompanyService,
    public userService: UserService, private authService: AuthService, private navbarTitleService: NavbarTitleService, 
    private notificationService: NotificationService) { 

    }

  public ngOnInit() {
    
    this.navbarTitleService.updateTitle('Dashboard');

    // this.regionsChartType = ChartType.Pie;
    this.regionsChartData = {
      labels: [],
      series: []
    };


    // this.getCountries();
    // this.getUsers('');
    


  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.updatePie();
      this.updateLine();
      this.updateBar();
    }, 1000);

  }

  isUser(){
    return this.userService.isUser();
  }

  isAdmin(){
    return this.userService.isAdmin();
  }

  
  isAuth(){
    return this.userService.isAuth();
  }

  buildRegionsChart(){
    // console.log(this.countries);
    var values=[];
    var valuesLabel = [];
    var colors = [];
    var count =0;
    this.pieChartLabels = [];
    this.pieChartData = [];
    if(this.countries)
    this.countries.forEach(country => {

      var color = "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," +Math.floor(Math.random() * 255) + ")";  
      if(this.dataUsersPie)
      this.dataUsersPie.forEach(user => {
        if(country.country_id==user.country_id) 
          count++;
      });
      
      if(count>0){
        values.push(count);
        valuesLabel.push(country.name);
        colors.push(this.getRandomColor());
        // this.pieChartLabels.push(count.toString());
        count = 0;
      }
     
    });

    this.pieChartData = (values);
    this.pieChartLabels = (valuesLabel);
    this.pieChartColors =[
      { backgroundColor: colors },
     ];

  }

  
  buildUsersChart(){
    // console.log(this.countries);
    var values=[];
    var valuesF=[], valuesM=[];
    var Jan=0, Feb=0, Mar=0, Apr=0, Mai=0, Jun=0, Jul=0, Aug=0, Sep=0, Oct= 0, Nov =0, Dec = 0;
    var JanF=0, FebF=0, MarF=0, AprF=0, MaiF=0, JunF=0, JulF=0, AugF=0, SepF=0, OctF= 0, NovF =0, DecF = 0;
    var JanM=0, FebM=0, MarM=0, AprM=0, MaiM=0, JunM=0, JulM=0, AugM=0, SepM=0, OctM= 0, NovM =0, DecM = 0;
    // moment.locale('es');
    if(this.dataUsersLine)
    this.dataUsersLine.forEach(user => {
      // console.log(user.name);
      var month = +moment(user.date_modified.$date).utc().format('M');
      // console.log(month);
        switch (month) {
          case 1:
          Jan++;
          if(user.gender == 'female') JanF++;
          if(user.gender == 'male') JanM++;
          break;
          case 2:
          Feb++;
          if(user.gender == 'female') FebF++;
          if(user.gender == 'male') FebM++;
          break;
          case 3:
          Mar++;
          if(user.gender == 'female') MarF++;
          if(user.gender == 'male') MarM++;
          break;
          case 4:
          Apr++;
          if(user.gender == 'female') AprF++;
          if(user.gender == 'male') AprM++;
          break;
          case 5:
          Mai++;
          if(user.gender == 'female') MaiF++;
          if(user.gender == 'male') MaiM++;
          break;
          case 6:
          Jun++;
          if(user.gender == 'female') JunF++;
          if(user.gender == 'male') JunM++;
          break;
          case 7:
          Jul++;
          if(user.gender == 'female') JulF++;
          if(user.gender == 'male') JulM++;
          break;
          case 8:
          Aug++;
          if(user.gender == 'female') AugF++;
          if(user.gender == 'male') AugM++;
          break;
          case 9:
          Sep++;
          if(user.gender == 'female') SepF++;
          if(user.gender == 'male') SepM++;
          break;
          case 10:
          Oct++;
          if(user.gender == 'female') OctF++;
          if(user.gender == 'male') OctM++;
          break;
          case 11:
          Nov++;
          if(user.gender == 'female') NovF++;
          if(user.gender == 'male') NovM++;
          break;
          case 12:
          Dec++;
          if(user.gender == 'female') DecF++;
          if(user.gender == 'male') DecM++;
          break;
        }
        // count = 0;
      });

      values= [Jan, Feb, Mar, Apr, Mai, Jun, Jul, Aug, Sep, Oct, Nov, Dec];
      valuesF= [JanF, FebF, MarF, AprF, MaiF, JunF, JulF, AugF, SepF, OctF, NovF, DecF];
      valuesM= [JanM, FebM, MarM, AprM, MaiM, JunM, JulM, AugM, SepM, OctM, NovM, DecM];
      this.lineChartData = [
        {
        data: values,
        label: 'Usuarios'
        }, 
        // {
        //   data: valuesF,
        //   label: 'Femeninos'
        // },
        // {
        //   data: valuesM,
        //   label: 'Masculinos'
        // } 
    
    ];
      // console.log(values);
  }

  buildPlansChart(){
    // console.log(this.countries);
    var labels=[];
    var data = [];
    this.barChartLabels = ['Planes cotizados'];
    this.barChartData = [];
          if(this.dataPlan)
          this.dataPlan.forEach((plan, index)=>{
  
            // console.log(plan);  
            labels.push(plan.fields.plan_name);  
            data.push(
              {
                data: [plan.plan_count],
                label: plan.fields.plan_name + ' ('+plan.fields.company_name+')',
                company: plan.fields.company_name,
              }
            );
            // this.barChartData.push(data[index]);
            // this.barChartLabels = [...this.barChartLabels, labels[index]];
            // this.newDataPoint(plan, plan.fields.company_name);
            
          //   if(!labels.includes(plan.fields.company_name))
          //   labels.push(plan.fields.company_name);  
            
          //   if(labels.includes(plan.fields.company_name))
          //     data.push(
          //       {
          //         data: [plan.plan_count],
          //         label: plan.fields.plan_name,
          //         company: plan.fields.company_name,
          //       }
          //     );
          //     else
          //     data = [];
            
          });

          // this.barChartLabels = labels;
          this.barChartData = data;
          // console.log(data);



  }

  newDataPoint(dataArr = [100, 100, 100], label) {

    this.barChartData.forEach((dataset, index) => {
      this.barChartData[index] = Object.assign({}, this.barChartData[index], {
        data: [...this.barChartData[index].data, dataArr[index]]
      });
    });
  
    this.barChartLabels = [...this.barChartLabels, label];
  
  }

  getUsers(q:string){
    //console.log(this.rols);
    this.userService.getUsers(q).subscribe(
        (response) =>{
          this.dataUsersPie = response;
          this.dataUsersPie = this.dataUsersPie.filter(i => i.user_type ==4 || i.user_type ==null)
          this.dataUsersLine = response;
          this.dataUsersLine = this.dataUsersLine.filter(i => i.user_type ==4 || i.user_type ==null)
          this.dataUsersBar = response;
          this.dataUsersBar = this.dataUsersLine.filter(i => i.user_type ==4 || i.user_type ==null)
          // console.log(this.dataUsersPie);
        },
        (error) => { 
          this.showNotification('top', 'center', '<b>Error</b>', 'pe-7s-attention', 4); 
          console.log(error); 
          this.progressLine=false;
          this.progressPie =false; 
          this.dataUsersPie = [];
          this.dataUsersLine = [];
        }, 
        //() => this.onCompleteLogin()
    );
  }

  getCountries(){
    this.companyService.getCountries('').subscribe(
      (response) => {
        // console.log(response);
        this.progressPie = false; 
        this.countries = response;
      },
      (error) => { 
        this.showNotification('top', 'center', '<b>Error</b>', 'pe-7s-attention', 4); 
        this.progressPie=false; 
        this.progressLine = false;
      }, 

    )
   
  }

  getPLans(company_id){
    this.companyService.getCompanyPlans(company_id).subscribe(
      data=>{
        //console.log(data);
        if(data['Error']) 
          this.dataPlan = [];
          else
          this.dataPlan = data;
      }
    );
  }

  getStasPLans(){
    this.userService.getStatsPlans().subscribe(
      data=>{
        //console.log(data);
        if(data['Error']) 
          this.dataPlan = [];
          else
          this.dataPlan = data;
      }
    );
  }

  getCompanies(q:string){
 
    this.companyService.getCompanies(q).subscribe(
        (response) => {
          this.progressBar = false; 
          this.companies = response;
        },
        (error) => { 
          this.showNotification('top', 'center', '<b>Error</b>', 'pe-7s-attention', 4); 
          this.progressBar = false;
          console.log(error.json()); 
        }, 
        //() => this.onCompleteLogin()
    );
  }

  getColor(){ 
    return "hsl(" + 360 * Math.random() + ',' +
               (25 + 70 * Math.random()) + '%,' + 
               (85 + 10 * Math.random()) + '%)'
  }

  getRandomColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }

  updatePie(){
    this.progressPie = true;
    this.getCountries();
    this.getUsers('');
    setTimeout(() => {
      this.buildRegionsChart();
      this.progressPie = false;
    }, 3000);
    
  }

  updateLine(){
    // this.getCountries();
    this.progressLine= true;
    this.getUsers('');
    setTimeout(() => {
      this.buildUsersChart();
      this.progressLine = false;
    }, 3000);

  }

  updateBar(){
    // this.getCountries();
    this.progressBar= true;
    this.getStasPLans();
    // this.getUsers('');
    // this.getCompanies('');
    setTimeout(() => {
      this.buildPlansChart();
      this.progressBar = false;
    }, 3000);

  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
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
