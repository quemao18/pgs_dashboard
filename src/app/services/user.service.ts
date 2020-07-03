import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as vars from '../config';
import { Http, Headers, URLSearchParams, RequestOptions, Jsonp } from '@angular/http';
//import { AUTH_CONFIG } from './auth0-variables';
//import { tokenNotExpired } from 'angular2-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

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
  nameUser :string = '';
  public sessionData: string;
  private isUserLoggedIn: boolean;
  public userLogged: any;


  constructor(private router: Router, private http: HttpClient) {
  
  }

  generateHeaders() {
    const headers = new HttpHeaders( {'Authorization': 'JWT '+ this.getAccessToken() } );
    return headers;
  }

  getAccessToken() { 
    return (localStorage.getItem('access_token'));
  }


  login(data: any) {
    return this.http.post(vars.apiUrl + 'v1/auth', data, {
        headers: this.generateHeaders(),
    });
  }

  getUser() {
    return this.http.get(vars.apiUrl + 'v1/account', {
        headers: this.generateHeaders(),
    });
  }

  getUsers(q:string){
    //console.log(pago);
    return this.http.get(vars.apiUrl + 'v1/account/accounts/'+q, 
    {headers: this.generateHeaders(),responseType: 'json'}
    )
  }

  
  getStatsPlans(){
    //console.log(pago);
    return this.http.get(vars.apiUrl + 'v1/account/stats_plans', 
    {headers: this.generateHeaders(),responseType: 'json'}
    )
  }


  putPass(user_id:string, pass:string){
    //console.log(user_id);
    return this.http.put(vars.apiUrl + 'v1/account/'+ user_id + '/password', {password:pass},
    {headers: this.generateHeaders(),responseType: 'json'}
    )
  }

  deleteUser(user_id:string){
    //console.log(user_id);
    return this.http.delete(vars.apiUrl + 'v1/account/'+ user_id,
    {headers: this.generateHeaders(),responseType: 'json'}
    )
  }

  public fileChange(event) {
    let fileList: FileList = event.target.files;
    if(fileList.length > 0) {
        let file: File = fileList[0];
        let formDataUpload:FormData = new FormData();
        formDataUpload.append('image', file, localStorage.getItem('id_user')+ '.' +file.name.split('.').pop());
        let headers = new Headers();
        /** No need to include Content-Type in Angular 4 */
        //headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
        let options = new RequestOptions({ headers: headers });
        return this.http.post(vars.apiUrl+ "/users/upload_avatar/"+vars.nameKeyApi+"/"+vars.keyApi, formDataUpload, {
          headers: this.generateHeaders(),
          responseType: 'json'
        })
        //    .map(res => res);
        //return this.http.post(vars.apiUrl+ "/news/upload/", +formDataUpload+"&"+vars.nameKeyApi+"="+vars.keyApi, options)
        .pipe(map(res => res));
  
            
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

  setUserLoggedIn(user: any) {
    //this.isUserLoggedIn = true;
    this.userLogged = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getIsUserLoggedIn() {
    return this.isUserLoggedIn; 
  }

  setIsUserLoggedIn(token) {
    this.isUserLoggedIn = true;
    localStorage.setItem('access_token', token);
  }

  getUserLoggedIn() {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  logout(){
    this.isUserLoggedIn = false;
    this.userLogged = [];
    localStorage.removeItem('currentUser');
    localStorage.removeItem('access_token')
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