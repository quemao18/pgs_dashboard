import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as vars from '../config';
import { Http, Headers, URLSearchParams, RequestOptions, Jsonp } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class NewService {

  constructor(private router: Router, private http: Http) {
  
  }

  public getNews(){
      //console.log(pago);
      return this.http.get(vars.apiUrl + '/news/news/' + vars.nameKeyApi + '/' + vars.keyApi)
  }

  public getEvents(){
      //console.log(pago);
      return this.http.get(vars.apiUrl + '/news/events/' + vars.nameKeyApi + '/' + vars.keyApi)
  }

  public newNew(data){
      //console.log(pago);
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(vars.apiUrl+ "/news/new_new/", "new="+JSON.stringify(data)+"&"+vars.nameKeyApi+"="+vars.keyApi, options)
      .map(res => res);
  }

  public newEvent(event){
      //console.log(pago);
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(vars.apiUrl+ "/news/new_event/", "event="+JSON.stringify(event)+"&"+vars.nameKeyApi+"="+vars.keyApi, options)
      .map(res => res);
  }
  
  public deleteNew(data){
      //console.log(pago);
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(vars.apiUrl+ "/news/delete_new/", "new="+JSON.stringify(data)+"&"+vars.nameKeyApi+"="+vars.keyApi, options)
      .map(res => res);
  }


  public updateNew(data){
      //console.log(pago);
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(vars.apiUrl+ "/news/update_new/", "new="+JSON.stringify(data)+"&"+vars.nameKeyApi+"="+vars.keyApi, options)
      .map(res => res);
  }


  public getStatus(id_new){
      //console.log(pago);
    return this.http.get(vars.apiUrl + '/news/new_status/id_new/'+ id_new +'/' + vars.nameKeyApi + '/' + vars.keyApi)
  }


  public updateStatus(data){
  //console.log(pago);
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(vars.apiUrl+ "/news/update_status/", "new="+JSON.stringify(data)+"&"+vars.nameKeyApi+"="+vars.keyApi, options)
    .map(res => res);
}

  public fileChange(event) {
    let fileList: FileList = event.target.files;
    if(fileList.length > 0) {
        let file: File = fileList[0];
        let formDataUpload:FormData = new FormData();
        formDataUpload.append('image', file, file.name);
        let headers = new Headers();
        //console.log(file);
        /** No need to include Content-Type in Angular 4 */
        //headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
        let options = new RequestOptions({ headers: headers });
        return this.http.post(vars.apiUrl+ "/news/upload/"+vars.nameKeyApi+"/"+vars.keyApi, formDataUpload, options)
        //    .map(res => res);
        //return this.http.post(vars.apiUrl+ "/news/upload/", +formDataUpload+"&"+vars.nameKeyApi+"="+vars.keyApi, options)
        .map(res => res);    
            
    }
}


}
