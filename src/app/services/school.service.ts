import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as vars from '../config';
import { Http, Headers, URLSearchParams, RequestOptions, Jsonp } from '@angular/http';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SchoolService {

  constructor(private router: Router, private http: Http) {
  
  }

  public getSchools(q){
      //console.log(pago);
      return this.http.get(vars.apiUrl + '/schools/schools/' + vars.nameKeyApi + '/' + vars.keyApi + '/q/' + q)
  }


  public newSchool(school){
      //console.log(pago);
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(vars.apiUrl+ "/schools/new_school/", "school="+JSON.stringify(school)+"&"+vars.nameKeyApi+"="+vars.keyApi, options)
      .pipe(map(res => res));
  }


    public deleteSchool(school){
      //console.log(pago);
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(vars.apiUrl+ "/schools/delete_school/", "school="+JSON.stringify(school)+"&"+vars.nameKeyApi+"="+vars.keyApi, options)
      .pipe(map(res => res));
  }

  public updateSchool(school){
      //console.log(pago);
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(vars.apiUrl+ "/schools/update_school/", "school="+JSON.stringify(school)+"&"+vars.nameKeyApi+"="+vars.keyApi, options)
      .pipe(map(res => res));
  }

  public getStatus(id_school){
      //console.log(pago);
    return this.http.get(vars.apiUrl + '/schools/school_status/id_school/'+ id_school +'/' + vars.nameKeyApi + '/' + vars.keyApi)
  }

  public getDuration(url){
    //console.log(pago);
  return this.http.get(vars.apiUrl + '/schools/youtube_duration?url='+ url +'&' + vars.nameKeyApi + '=' + vars.keyApi)
}


  public updateStatus(school){
  //console.log(pago);
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(vars.apiUrl+ "/schools/update_status/", "school="+JSON.stringify(school)+"&"+vars.nameKeyApi+"="+vars.keyApi, options)
    .pipe(map(res => res));
}

}
