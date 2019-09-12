import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as vars from '../config';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';

@Injectable()
export class CompanyService {

  constructor(private router: Router, private http: HttpClient) {
  
  }

  generateHeaders() {
    const headers = new HttpHeaders( {'Authorization': 'JWT '+ this.getAccessToken() } );
    return headers;
  }

  getAccessToken() {
    return (localStorage.getItem('access_token'));
  }

  
  getCompany(company_id){
    //console.log(pago);
    return this.http.get(vars.apiUrl + 'v1/company/'+company_id, 
    {headers: this.generateHeaders(),responseType: 'json'}
    )
  }

  

}
