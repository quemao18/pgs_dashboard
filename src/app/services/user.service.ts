import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as vars from '../config';
import { Http, Headers, URLSearchParams, RequestOptions, Jsonp } from '@angular/http';
//import { AUTH_CONFIG } from './auth0-variables';
//import { tokenNotExpired } from 'angular2-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  getUsers(q){
    //console.log(pago);
    return this.http.get(vars.apiUrl + 'v1/account/accounts/'+q, 
    {headers: this.generateHeaders(),responseType: 'json'}
    )
  }


  getCompanies(){
    //console.log(pago);
    return this.http.get(vars.apiUrl + 'v1/company/companies', 
    {headers: this.generateHeaders(),responseType: 'json'}
    )
  }

  putPass(user_id, pass){
    //console.log(user_id);
    return this.http.put(vars.apiUrl + 'v1/account/'+ user_id + '/password', {password:pass},
    {headers: this.generateHeaders(),responseType: 'json'}
    )
  }

  deleteUser(user_id){
    //console.log(user_id);
    return this.http.delete(vars.apiUrl + 'v1/account/'+ user_id,
    {headers: this.generateHeaders(),responseType: 'json'}
    )
  }


  public getRols(){
      //console.log(pago);
      return this.http.get(vars.apiUrl + '/users/users_rols/' + vars.nameKeyApi + '/' + vars.keyApi)
  }



public getSubCompanies(id_company){
    //console.log(pago);
    return this.http.get(vars.apiUrl + '/users/sub_companies/id_company/' + id_company + '/' + vars.nameKeyApi + '/' + vars.keyApi)
}

  public getPositions(){
      //console.log(pago);
      return this.http.get(vars.apiUrl + '/users/users_positions/' + vars.nameKeyApi + '/' + vars.keyApi)
  }
  
  public getQuestions(){
      //console.log(pago);
      return this.http.get(vars.apiUrl + '/users/users_questions/' + vars.nameKeyApi + '/' + vars.keyApi)
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
      return this.http.post(vars.apiUrl+ "/users/update_user/", "user="+JSON.stringify(user), 
       
      )
      .map(res => res);
  }

    public updateUserApp(user, sponsor, platinum){
      //console.log(pago);
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(vars.apiUrl+ "/users/update_user_app/", "user="+JSON.stringify(user)+"&sponsor="+JSON.stringify(sponsor)+"&platinum="+JSON.stringify(platinum)+"&"+vars.nameKeyApi+"="+vars.keyApi, {headers: this.generateHeaders(),responseType: 'json'})
      .map(res => res);
  }

  public updateUserAppBack(user, sponsor, platinum){
    //console.log(pago);
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(vars.apiUrl+ "/users/update_user_app_back/", "user="+JSON.stringify(user)+"&sponsor="+JSON.stringify(sponsor)+"&platinum="+JSON.stringify(platinum)+"&"+vars.nameKeyApi+"="+vars.keyApi, {headers: this.generateHeaders(),responseType: 'json'})
    .map(res => res);
}
    public newUser(user){
      //console.log(pago);
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(vars.apiUrl+ "/users/new_user/", "user="+JSON.stringify(user)+"&"+vars.nameKeyApi+"="+vars.keyApi, {
        headers: this.generateHeaders(),
        responseType: 'json'
      })
      .map(res => res);
  }

  //   public deleteUser(user){
  //     //console.log(pago);
  //     let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
  //     let options = new RequestOptions({ headers: headers });
  //     return this.http.post(vars.apiUrl+ "/users/delete_user/", "user="+JSON.stringify(user)+"&"+vars.nameKeyApi+"="+vars.keyApi, {
  //       headers: this.generateHeaders(),
  //       responseType: 'json'
  //     })
  //     .map(res => res);
  // }

     public newUserApp(user, sponsor, platinum){
      //console.log(pago);
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(vars.apiUrl+ "/users/new_user_app/", "user="+JSON.stringify(user)+"&sponsor="+JSON.stringify(sponsor)+"&platinum="+JSON.stringify(platinum)+"&"+vars.nameKeyApi+"="+vars.keyApi, {
        headers: this.generateHeaders(),
        responseType: 'json'
      })
      .map(res => res);
  }

    public updateStatus(user){
      //console.log(pago);
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(vars.apiUrl+ "/users/update_status/", "user="+JSON.stringify(user)+"&"+vars.nameKeyApi+"="+vars.keyApi, {
        headers: this.generateHeaders(),
        responseType: 'json'
      })
      .map(res => res);
  }

    public getStatus(ita){
      //console.log(pago);
      return this.http.get(vars.apiUrl + '/users/user_status/ita/'+ ita +'/' + vars.nameKeyApi + '/' + vars.keyApi)
  }

  public getUserEmail(email){
      //console.log(pago);
      return this.http.get(vars.apiUrl + '/users/user_email/email/'+ email +'/' + vars.nameKeyApi + '/' + vars.keyApi)
  }

   forgetPass(user){
      //console.log(pago);
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(vars.apiUrl+ "/users/forget/", "user="+JSON.stringify(user)+"&"+vars.nameKeyApi+"="+vars.keyApi, {
        headers: this.generateHeaders(),
        responseType: 'json'
      })
      .map(res => res);
  }
   
   forgetPass2(user){
      //console.log(pago);
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(vars.apiUrl+ "/users/forget_2/", "user="+JSON.stringify(user)+"&"+vars.nameKeyApi+"="+vars.keyApi, {
        headers: this.generateHeaders(),
        responseType: 'json'
      })
      .map(res => res);
  }

   changePass(user){
      //console.log(pago);
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      let options = new RequestOptions({ headers: headers });
      return this.http.put(vars.apiUrl+ "v1/account/change_password/", "user="+JSON.stringify(user)+"&"+vars.nameKeyApi+"="+vars.keyApi, {
        headers: this.generateHeaders(),
        responseType: 'json'
      })
      .map(res => res);
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

  setUserLoggedIn(user: any) {
    //this.isUserLoggedIn = true;
    this.userLogged = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getIsUserLoggedIn() {
    return this.isUserLoggedIn; 
  }

  getAccessToken() {
    return (localStorage.getItem('access_token'));
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