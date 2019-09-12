import { Component, OnInit } from '@angular/core';
import { FooterItem } from '../lbd/lbd-footer/lbd-footer.component';
import * as vars from '../config';

@Component({
  selector: 'app-footer-layout',
  templateUrl: './footer-layout.component.html'
})
export class FooterLayoutComponent implements OnInit {
  public footerItems: FooterItem[];
  public copyright: string;

  constructor() { }

  public ngOnInit() {
    this.footerItems = [
      {title:'Política de privacidad', routerLink: '/policity'},
      /*
      { title: 'Inicio', routerLink: '/dashboard' },
      { title: 'Usuarios', routerLink: '/users' },
      { title: 'Usuarios App', routerLink: '/users-app' },
      { title: 'Audios', routerLink: '/audios' },
      { title: 'Videos', routerLink: '/videos' },
      { title: 'Escuela de Negocios', routerLink: '/schooll' },
      { title: 'Noticias', routerLink: '/news' },
      */
   ];
   
    this.copyright = '&copy; <a href="'+ vars.url + '">'+vars.app+'</a>';
  }
}
