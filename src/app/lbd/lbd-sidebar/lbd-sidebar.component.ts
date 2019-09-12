import {Component, Input, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { NavbarTitleService } from '../services/navbar-title.service';
// import { NavItem, NavItemType } from '../lbd.module';
import { MobileSidebarToggleService } from '../services/mobile-sidebar-toggle.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { NavItem, NavItemType } from '../../app.component';
export type BackgroundColor = 'blue' | 'azure' | 'green' | 'orange' | 'red' | 'purple';


@Component({
  selector: 'lbd-sidebar',
  templateUrl: './lbd-sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LbdSidebarComponent implements OnInit{
  @Input()
  public headerText: string;

  @Input()
  public headerLink: string;

  @Input()
  public headerLogoImg: string;

  @Input()
  public backgroundColor: BackgroundColor;

  @Input()
  public backgroundImg: string;

  @Input()
  public navItems: NavItem[];

  public title: string;
  public userName: string; 

  constructor(private navbarTitleService: NavbarTitleService, private mobileSidebarToggleService: MobileSidebarToggleService,
              private cd: ChangeDetectorRef, public auth: AuthService, private userService: UserService) { }

  public ngOnInit(): void {
  
    this.navbarTitleService.titleChanged$.subscribe(title => {
      this.title = title;
      //this.userName = this.auth.getNameUser();
      this.cd.markForCheck();
    });

  }
  
  backgroundStyle(): { [id: string]: string; } {
   
    return { 'background-image': `url(${this.backgroundImg})` };
  }


  public get sidebarItems(): NavItem[] {

    if(this.userService.isAdmin())
    return this.navItems.filter(i => i.type === NavItemType.Sidebar && i.isLoggedIn === this.auth.authenticated() && i.isAdminIn === this.userService.isAdmin());
    if(this.userService.isAuth())
    return this.navItems.filter(i => i.type === NavItemType.Sidebar && i.isLoggedIn === this.auth.authenticated() && i.isAuthIn === this.userService.isAuth());
    if(this.userService.isPublish())
    return this.navItems.filter(i => i.type === NavItemType.Sidebar && i.isLoggedIn === this.auth.authenticated() && i.isPublishIn === this.userService.isPublish());
    if(this.userService.isUser())
    return this.navItems.filter(i => i.type === NavItemType.Sidebar && i.isLoggedIn === this.auth.authenticated() && i.isUserIn === this.userService.isUser());
  
  return this.navItems.filter(i => i.type === NavItemType.Sidebar && i.isLoggedIn === this.auth.authenticated() );
  
  }


  public get navbarItems(): NavItem[] {
    return this.navItems.filter(i => i.type === NavItemType.NavbarLeft || i.type === NavItemType.NavbarRight);
  }

}
