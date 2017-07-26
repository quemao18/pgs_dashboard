import { Injectable, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as vars from '../config';
import { Http, Headers, URLSearchParams, RequestOptions, Jsonp } from '@angular/http';
import { UserService } from '../services/user.service';
//import { AUTH_CONFIG } from './auth0-variables';
//import { tokenNotExpired } from 'angular2-jwt';

// Avoid name not found warnings
declare var auth0: any;

@Injectable()
export class AuthService {
  // Create Auth0 web auth instance
  // @TODO: Update AUTH_CONFIG and remove .example extension in src/app/auth/auth0-variables.ts.example
  /*
  auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.CLIENT_ID,
    domain: AUTH_CONFIG.CLIENT_DOMAIN
  });
*/
  // Create a stream of logged in status to communicate throughout app
  loggedIn: boolean;
  loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);
  error: string;
  error$ = new BehaviorSubject<string>(this.error);
  nameUser :string = 'Rigoberto Rodriguez';
  @Output() getLoggedInName: EventEmitter<any> = new EventEmitter();
  @Output() isLoggedIn: EventEmitter<boolean> = new EventEmitter();

  constructor(private router: Router, private http: Http, private userService: UserService) {

  
  }

  setName(name: string) {
    // Update login status subject
    //this.loggedIn$.next(value);
    //this.loggedIn = value;
    this.getLoggedInName.emit(name);
  }

  setLoggedIn(value: boolean) {
    // Update login status subject
    this.loggedIn$.next(value);
    this.loggedIn = value;
  }

  setError(value: string) {
    // Update login status subject
    this.error$.next(value);
    this.error = value;
  }

 login(user){
      //console.log(pago);
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(vars.apiUrl+ "/users/user/", "user="+JSON.stringify(user)+"&"+vars.nameKeyApi+"="+vars.keyApi, options)
      .map(res => res);
  }

  logout() {
    localStorage.clear();
    this.getLoggedInName.subscribe(name => this.changeName(''));
    this.setLoggedIn(false);
    this.userService.setIsAdmin(false);
    this.userService.setIsAuth(false);
    this.userService.setIsPublish(false);
    this.userService.setIsUser(false);
    this.router.navigate(['/login']);
   
  }

  public authenticated(){
    return this.loggedIn;
    // Check if there's an unexpired access token
    //return tokenNotExpired('token');
  }

  public getError(){
    return this.error;
    // Check if there's an unexpired access token
    //return tokenNotExpired('token');
  }
  public getNameUser(){
     //return this.getLoggedInName.subscribe(name => this.changeName(name));
    //return this.getLoggedInName;
    return localStorage.getItem('name') + ' ' + localStorage.getItem('last');
  }

  private changeName(name: string) {
       return this.nameUser = name;
    }
}