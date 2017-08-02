import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as vars from '../config';
import { Http, Headers, URLSearchParams, RequestOptions, Jsonp } from '@angular/http';

@Injectable()
export class MediaService {

  constructor(private router: Router, private http: Http) {
  
  }

  public getMedias(){
      //console.log(pago);
      return this.http.get(vars.apiUrl + '/medias/medias/' + vars.nameKeyApi + '/' + vars.keyApi)
  }

  public getCategories(){
      //console.log(pago);
      return this.http.get(vars.apiUrl + '/medias/categories/' + vars.nameKeyApi + '/' + vars.keyApi)
  }

  public getSubCategories(id_category){
      //console.log(pago);
      return this.http.get(vars.apiUrl + '/medias/sub_categories/id_category/' + id_category + '/' + vars.nameKeyApi + '/' + vars.keyApi)
  }

  public newMedia(media){
      //console.log(pago);
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(vars.apiUrl+ "/medias/new_media/", "media="+JSON.stringify(media)+"&"+vars.nameKeyApi+"="+vars.keyApi, options)
      .map(res => res);
  }

  public newCategory(category){
      //console.log(pago);
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(vars.apiUrl+ "/medias/new_category/", "category="+JSON.stringify(category)+"&"+vars.nameKeyApi+"="+vars.keyApi, options)
      .map(res => res);
  }
  
  public deleteMedia(media){
      //console.log(pago);
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(vars.apiUrl+ "/medias/delete_media/", "media="+JSON.stringify(media)+"&"+vars.nameKeyApi+"="+vars.keyApi, options)
      .map(res => res);
  }

  public newSubCategory(subcategory){
      //console.log(pago);
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(vars.apiUrl+ "/medias/new_sub_category/", "sub_category="+JSON.stringify(subcategory)+"&"+vars.nameKeyApi+"="+vars.keyApi, options)
      .map(res => res);
  }

  public updateMedia(media){
      //console.log(pago);
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(vars.apiUrl+ "/medias/update_media/", "media="+JSON.stringify(media)+"&"+vars.nameKeyApi+"="+vars.keyApi, options)
      .map(res => res);
  }


  public getStatus(id_media){
      //console.log(pago);
    return this.http.get(vars.apiUrl + '/medias/media_status/id_media/'+ id_media +'/' + vars.nameKeyApi + '/' + vars.keyApi)
  }


  public updateStatus(media){
  //console.log(pago);
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(vars.apiUrl+ "/medias/update_status/", "media="+JSON.stringify(media)+"&"+vars.nameKeyApi+"="+vars.keyApi, options)
    .map(res => res);
}


}
