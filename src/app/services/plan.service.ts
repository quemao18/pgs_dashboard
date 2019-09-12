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

  
  getPlan(plan_id){
    //console.log(pago);
    return this.http.get(vars.apiUrl + 'v1/plan/'+plan_id, 
    {headers: this.generateHeaders(),responseType: 'json'}
    )
  }

  

}
