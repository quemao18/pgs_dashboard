import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { NavItem } from '../lbd.module';
import { AuthService } from '../../services/auth.service';


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
