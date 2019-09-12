import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { NavItem } from '../../app.component';

@Component({
  selector: 'lbd-sidebar-items',
  templateUrl: './lbd-sidebar-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LbdSidebarItemsComponent {
  @Input()
  navItems: NavItem[];

  @Input()
  navbarClass: string;

  @Input()
  showSeparator: boolean;

  //@Input()
  isLoggedIn : boolean;

  @Input()
  userName: string;
  constructor(private userService: UserService, private auth:AuthService) { 

    this.auth.getLoggedInName.subscribe(name => this.changeName(name)); 
  }

      private changeName(name: string): void {
        this.userName = name;
    }

}
