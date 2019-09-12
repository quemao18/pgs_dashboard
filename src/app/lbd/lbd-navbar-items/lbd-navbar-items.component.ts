import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { NavItem } from '../../app.component';


@Component({
  selector: 'lbd-navbar-items',
  templateUrl: './lbd-navbar-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LbdNavbarItemsComponent {
  @Input()
  navItems: NavItem[];

  @Input()
  navbarClass: string;

  @Input()
  showTitles: boolean;
  
  @Input()
  userName: string;

  constructor(private auth:AuthService,) { this.auth.getLoggedInName.subscribe(name => this.changeName(name)); }

      private changeName(name: string): void {
        this.userName = name;
    }
}
