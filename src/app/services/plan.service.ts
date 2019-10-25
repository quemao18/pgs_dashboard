import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as vars from '../config';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';

@Injectable()
export class PlanService {

  constructor(private router: Router, private http: HttpClient) {
  
  }

  generateHeaders() {
    const headers = new HttpHeaders( {'Authorization': 'JWT '+ this.getAccessToken() } );
    return headers;
  }

  getAccessToken() {
    return (localStorage.getItem('access_token'));
  }

  
  getPlan(plan_id:string){
    //console.log(pago);
    return this.http.get(vars.apiUrl + 'v1/plan/'+plan_id, 
    {headers: this.generateHeaders(),responseType: 'json'}
    )
  }

  postPlan(data:any){
    //console.log(user_id);
    return this.http.post(vars.apiUrl + 'v1/plan' , data,
    {headers: this.generateHeaders(),responseType: 'json'}
    )
  }

  putPlan(data:any){
    // console.log(data.plan_id);
    return this.http.put(vars.apiUrl + 'v1/plan/'+data.plan_id , data,
    {headers: this.generateHeaders(),responseType: 'json'}
    )
  }

  putStatus(id: string){
    //console.log('token', this.access_token);
    return this.http.put(vars.apiUrl + 'v1/plan/'+ id + '/status',
    {headers: this.generateHeaders(),responseType: 'json'}
    )
  }

  deletePlan(id:string){
    //console.log(user_id);
    return this.http.delete(vars.apiUrl + 'v1/plan/' +id,
    {headers: this.generateHeaders(),responseType: 'json'}
    )
  }

  

}
