import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as vars from '../config';
import { Http, Headers, URLSearchParams, RequestOptions, Jsonp } from '@angular/http';
//import { AUTH_CONFIG } from './auth0-variables';
//import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class UserService {
  // Create a stream of logged in status to communicate throughout app
  loggedIn: boolean;
  loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);
  adminIn: boolean;
  adminIn$ = new BehaviorSubject<boolean>(this.adminIn);
  authIn: boolean;
  authIn$ = new BehaviorSubject<boolean>(this.authIn);
  publishIn: boolean;
  publishIn$ = new BehaviorSubject<boolean>(this.publishIn);
  userIn: boolean;
  userIn$ = new BehaviorSubject<boolean>(this.userIn);
  error: string;
  error$ = new BehaviorSubject<string>(this.error);
  nameUser :string = 'Rigoberto Rodriguez';

  constructor(private router: Router, private http: Http) {
  
  }

  public getRols(){
      //console.log(pago);
      return this.http.get(vars.apiUrl + '/users/users_rols/' + vars.nameKeyApi + '/' + vars.keyApi)
  }

  public getPositions(){
      //console.log(pago);
      return this.http.get(vars.apiUrl + '/users/users_positions/' + vars.nameKeyApi + '/' + vars.keyApi)
  }
  
  public getQuestions(){
      //console.log(pago);
      return this.http.get(vars.apiUrl + '/users/users_questions/' + vars.nameKeyApi + '/' + vars.keyApi)
  }

     public getUsers(q){
      //console.log(pago);
      return this.http.get(vars.apiUrl + '/users/users/' + vars.nameKeyApi + '/' + vars.keyApi + '/q/' + q)
  }

    public getUsersApp(q){
      //console.log(pago);
      return this.http.get(vars.apiUrl + '/users/users_app/' + vars.nameKeyApi + '/' + vars.keyApi + '/q/' + q)
  }

    public getUsersBackEnd(q){
      //console.log(pago);
      return this.http.get(vars.apiUrl + '/users/users_backend/' + vars.nameKeyApi + '/' + vars.keyApi + '/q/' + q)
  }

    public updateUser(user){
      //console.log(pago);
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(vars.apiUrl+ "/users/update_user/", "user="+JSON.stringify(user)+"&"+vars.nameKeyApi+"="+vars.keyApi, options)
      .map(res => res);
  }

    public updateUserApp(user, sponsor, platinum){
      //console.log(pago);
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(vars.apiUrl+ "/users/update_user_app/", "user="+JSON.stringify(user)+"&sponsor="+JSON.stringify(sponsor)+"&platinum="+JSON.stringify(platinum)+"&"+vars.nameKeyApi+"="+vars.keyApi, options)
      .map(res => res);
  }
    public newUser(user){
      //console.log(pago);
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(vars.apiUrl+ "/users/new_user/", "user="+JSON.stringify(user)+"&"+vars.nameKeyApi+"="+vars.keyApi, options)
      .map(res => res);
  }

    public deleteUser(user){
      //console.log(pago);
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(vars.apiUrl+ "/users/delete_user/", "user="+JSON.stringify(user)+"&"+vars.nameKeyApi+"="+vars.keyApi, options)
      .map(res => res);
  }

     public newUserApp(user, sponsor, platinum){
      //console.log(pago);
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(vars.apiUrl+ "/users/new_user_app/", "user="+JSON.stringify(user)+"&sponsor="+JSON.stringify(sponsor)+"&platinum="+JSON.stringify(platinum)+"&"+vars.nameKeyApi+"="+vars.keyApi, options)
      .map(res => res);
  }

    public updateStatus(user){
      //console.log(pago);
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(vars.apiUrl+ "/users/update_status/", "user="+JSON.stringify(user)+"&"+vars.nameKeyApi+"="+vars.keyApi, options)
      .map(res => res);
  }

    public getStatus(ita){
      //console.log(pago);
      return this.http.get(vars.apiUrl + '/users/user_status/ita/'+ ita +'/' + vars.nameKeyApi + '/' + vars.keyApi)
  }

  public getUserIta(ita){
      //console.log(pago);
      return this.http.get(vars.apiUrl + '/users/user_ita/ita/'+ ita +'/' + vars.nameKeyApi + '/' + vars.keyApi)
  }

   forgetPass(user){
      //console.log(pago);
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(vars.apiUrl+ "/users/forget/", "user="+JSON.stringify(user)+"&"+vars.nameKeyApi+"="+vars.keyApi, options)
      .map(res => res);
  }
   
   forgetPass2(user){
      //console.log(pago);
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(vars.apiUrl+ "/users/forget_2/", "user="+JSON.stringify(user)+"&"+vars.nameKeyApi+"="+vars.keyApi, options)
      .map(res => res);
  }

   changePass(user){
      //console.log(pago);
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(vars.apiUrl+ "/users/change_password/", "user="+JSON.stringify(user)+"&"+vars.nameKeyApi+"="+vars.keyApi, options)
      .map(res => res);
  }

  public fileChange(event) {
    let fileList: FileList = event.target.files;
    if(fileList.length > 0) {
        let file: File = fileList[0];
        let formDataUpload:FormData = new FormData();
        formDataUpload.append('image', file, localStorage.getItem('ita')+ '.' +file.name.split('.').pop());
        let headers = new Headers();
        console.log(file.name.split('.').pop());
        /** No need to include Content-Type in Angular 4 */
        //headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
        let options = new RequestOptions({ headers: headers });
        return this.http.post(vars.apiUrl+ "/users/upload_avatar/"+vars.nameKeyApi+"/"+vars.keyApi, formDataUpload, options)
        //    .map(res => res);
        //return this.http.post(vars.apiUrl+ "/news/upload/", +formDataUpload+"&"+vars.nameKeyApi+"="+vars.keyApi, options)
        .map(res => res);    
            
    }
    }

    setIsAdmin(value: boolean) {
    this.adminIn$.next(value);
    this.adminIn = value;
  }


    setIsAuth(value: boolean) {
    this.authIn$.next(value);
    this.authIn = value;
  }

    setIsPublish(value: boolean) {
    this.publishIn$.next(value);
    this.publishIn = value;
  }

    setIsUser(value: boolean) {
    this.userIn$.next(value);
    this.userIn = value;
  }

  isAdmin(){
      return this.adminIn;
  }

  isAuth(){
      return  this.authIn;
  }

  isPublish(){
      return  this.publishIn;
  }

  isUser(){
      return  this.userIn;
  }

}