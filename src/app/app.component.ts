import {Component, OnInit} from '@angular/core';
import { NavItem, NavItemType } from './lbd/lbd.module';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  public navItems: NavItem[];
  public userName: string;

  constructor(private auth:AuthService) {  }


  public ngOnInit(): void {

    this.navItems = [
      { type: NavItemType.Sidebar, title: 'Inicio', routerLink: 'dashboard', iconClass: 'pe-7s-graph', isLoggedIn: true, isAdminIn:true, isAuthIn:true, isPublishIn:false, isUserIn:false },
      //{ type: NavItemType.Sidebar, title: 'Usuarios App', routerLink: 'user', iconClass: 'pe-7s-users',  isLoggedIn: true },
      //{ type: NavItemType.Sidebar, title: 'Table List', routerLink: 'table', iconClass: 'pe-7s-note2',  isLoggedIn: true },
      //{ type: NavItemType.Sidebar, title: 'Typography', routerLink: 'typography', iconClass: 'pe-7s-news-paper',  isLoggedIn: true },
      //{ type: NavItemType.Sidebar, title: 'Icons', routerLink: 'icons', iconClass: 'pe-7s-science',  isLoggedIn: true, isAdminIn:true, isAuthIn:true, isPublishIn:false, isUserIn:false },
      //{ type: NavItemType.Sidebar, title: 'Maps', routerLink: 'maps', iconClass: 'pe-7s-map-marker',  isLoggedIn: true },
      //{ type: NavItemType.Sidebar, title: 'Notifications', routerLink: 'notifications', iconClass: 'pe-7s-bell',  isLoggedIn: true },
      
      { type: NavItemType.Sidebar, title: 'Login', routerLink: 'login', iconClass: 'pe-7s-lock',  isLoggedIn: false, isAdminIn:false, isAuthIn:false, isPublishIn:false, isUserIn:false },
      { type: NavItemType.Sidebar, title: 'Usuarios', routerLink: 'users', iconClass: 'pe-7s-users', isLoggedIn: true, isAdminIn:true, isAuthIn:true, isPublishIn:false, isUserIn:false },
      { type: NavItemType.Sidebar, title: 'Usuarios App', routerLink: 'users-app', iconClass: 'pe-7s-phone', isLoggedIn: true, isAdminIn:true, isAuthIn:true, isPublishIn:false, isUserIn:false },
      { type: NavItemType.Sidebar, title: 'Audios', routerLink: 'audios', iconClass: 'pe-7s-headphones', isLoggedIn: true, isAdminIn:true, isAuthIn:true, isPublishIn:true, isUserIn:false },
      { type: NavItemType.Sidebar, title: 'Videos', routerLink: 'videos', iconClass: 'pe-7s-video', isLoggedIn: true, isAdminIn:true, isAuthIn:true, isPublishIn:true, isUserIn:false },
      { type: NavItemType.Sidebar, title: 'Escuela de negocios', routerLink: 'school', iconClass: 'pe-7s-portfolio', isLoggedIn: true, isAdminIn:true, isAuthIn:true, isPublishIn:true, isUserIn:false },
      { type: NavItemType.Sidebar, title: 'Noticias', routerLink: 'news', iconClass: 'pe-7s-news-paper', isLoggedIn: true, isAdminIn:true, isAuthIn:true, isPublishIn:true, isUserIn:false },
      //{ type: NavItemType.Sidebar, title: 'Salir', routerLink: 'logout', iconClass: 'pe-7s-close',  isLoggedIn: true },
      //{ type: NavItemType.NavbarRight, title: this.auth.getNameUser(), iconClass: 'pe-7s-user',  isLoggedIn: true },
      {
        type: NavItemType.NavbarRight,
        iconClass: 'pe-7s-user',
        title: 'Usuario',
        dropdownItems: [
          { title: 'Perfil', routerLink: 'profile' },
          { title: 'Cambiar password', routerLink: 'change-pass' },
          'separator',
          { title: 'Salir', routerLink: 'logout' },
        ],
        isLoggedIn: true, isAdminIn:true, isAuthIn:true, isPublishIn:true, isUserIn:true
      },
      /*
      { type: NavItemType.NavbarLeft, title: 'Dashboard', iconClass: 'fa fa-dashboard', isLoggedIn: true },
      {
        type: NavItemType.NavbarLeft,
        title: '5 Notifications',
        iconClass: 'fa fa-globe',
        numNotifications: 5,
        dropdownItems: [
          { title: 'Notification 1' },
          { title: 'Notification 2' },
          { title: 'Notification 3' },
          { title: 'Notification 4' },
          { title: 'Another Notification' }
        ],
        isLoggedIn: true
      },
      //{ type: NavItemType.NavbarLeft, title: 'Search', iconClass: 'fa fa-search' },
      {
        type: NavItemType.NavbarRight,
        title: 'Dropdown',
        dropdownItems: [
          { title: 'Action' },
          { title: 'Another action' },
          { title: 'Something' },
          { title: 'Another action' },
          { title: 'Something' },
          'separator',
          { title: 'Separated link' },
        ],
        isLoggedIn: true
      },*/
      //{ type: NavItemType.NavbarRight, title: 'Login', routerLink: 'login',  isLoggedIn: false },
      //{ type: NavItemType.NavbarRight, title: 'Salir', isLoggedIn: true },
    ];
  }
  
}
