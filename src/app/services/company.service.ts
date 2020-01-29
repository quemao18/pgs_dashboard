import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as vars from '../config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CompanyService {

  access_token: string;
  constructor(private router: Router, private http: HttpClient) {
    this.access_token =  (localStorage.getItem('access_token'));
  }

  generateHeaders() {
    const headers = new HttpHeaders( {'Authorization': 'JWT '+ this.access_token } );
    return headers;
  }

  
  getCompany(company_id: string){
    //console.log(pago);
    return this.http.get(vars.apiUrl + 'v1/company/'+company_id, 
    {headers: this.generateHeaders(),responseType: 'json'}
    )
  }

  getCompanyPlans(company_id: string){
    //console.log(pago);
    return this.http.get(vars.apiUrl + 'v1/company/'+company_id+'/plans', 
    {headers: this.generateHeaders(),responseType: 'json'}
    )
  }

  getCompanies(q:string){
    //console.log(pago);
    return this.http.get(vars.apiUrl + 'v1/company/companies/'+q, 
    {headers: this.generateHeaders(),responseType: 'json'}
    )
  }

  putStatus(id: string){
    //console.log('token', this.access_token);
    return this.http.put(vars.apiUrl + 'v1/company/'+ id + '/status',
    {headers: this.generateHeaders(),responseType: 'json'}
    )
  }

  putLogoUrl(downloadURL: string, id:string) {
    return this.http.put(vars.apiUrl + 'v1/company/'+ id + '/logo', {url:downloadURL},
    {headers: this.generateHeaders(),responseType: 'json'}
    )
  }

  putComparativeUrl(downloadURL: string, id:string) {
    return this.http.put(vars.apiUrl + 'v1/company/'+ id + '/comparative', {url:downloadURL},
    {headers: this.generateHeaders(),responseType: 'json'}
    )
  }

  putComparativePlanUrl(downloadURL: string, id:string) {
    return this.http.put(vars.apiUrl + 'v1/plan/'+ id + '/comparative', {url:downloadURL},
    {headers: this.generateHeaders(),responseType: 'json'}
    )
  }


  putCompany(data:any){
    //console.log(data);
    return this.http.put(vars.apiUrl + 'v1/company/'+ data.company_id , data,
    {headers: this.generateHeaders(),responseType: 'json'}
    )
  }

  postCompany(data:any){
    //console.log(user_id);
    return this.http.post(vars.apiUrl + 'v1/company' , data,
    {headers: this.generateHeaders(),responseType: 'json'}
    )
  }

  deleteCompany(id:string){
    //console.log(id);
    return this.http.delete(vars.apiUrl + 'v1/company/'+ id,
    {headers: this.generateHeaders(),responseType: 'json'}
    )
  }

  getCountries(q:string){
    //console.log(pago);
    return this.http.get(vars.apiUrl + 'v1/country/countries/'+q, 
    {headers: this.generateHeaders(),responseType: 'json'}
    )
  }

  postCountry(data:any){
    //console.log(user_id);
    return this.http.post(vars.apiUrl + 'v1/country' , data,
    {headers: this.generateHeaders(),responseType: 'json'}
    )
  }

  putCountry(data:any){
    //console.log(data);
    return this.http.put(vars.apiUrl + 'v1/country/'+ data.country_id , data,
    {headers: this.generateHeaders(),responseType: 'json'}
    )
  }

  
  putStatusCountry(id: string){
    //console.log('token', this.access_token);
    return this.http.put(vars.apiUrl + 'v1/country/'+ id + '/status',
    {headers: this.generateHeaders(),responseType: 'json'}
    )
  }

  deleteCountry(id:string){
    //console.log(id);
    return this.http.delete(vars.apiUrl + 'v1/country/'+ id,
    {headers: this.generateHeaders(),responseType: 'json'}
    )
  }
  getCountry(id: string){
    //console.log(pago);
    return this.http.get(vars.apiUrl + 'v1/country/'+id, 
    {headers: this.generateHeaders(),responseType: 'json'}
    )
  }

  public fileChange(event: any, company_id:string) {
    console.log(company_id)
    let fileList: FileList = event.target.files;
    if(fileList.length > 0) {
        let file: File = fileList[0];
        console.log('file', file);
        const formData = new FormData();
        formData.append('image', file, company_id+ '.' +file.name.split('.').pop());
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
        console.log(formData);
        return this.http.post(vars.apiUrl+ "v1/company/logo", formData, {
          headers: headers,
        });
            
    }
    }

  
  postFile(fileToUpload: File, id:string){
    const endpoint = vars.apiUrl+'v1/company/logo';
    const formData: FormData = new FormData();
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    formData.append('file', fileToUpload, id+ '.' +fileToUpload.name.split('.').pop());
    return this.http.post(endpoint, formData, 
      {headers:headers,responseType: 'json'})
      //.map(() => { return true; })
      //.catch( (e) => console.log(e) )
      
  }

}
