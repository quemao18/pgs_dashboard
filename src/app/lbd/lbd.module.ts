/*!

 =========================================================
 * Light Bootstrap Dashboard Free Angular2 - v1.3.0.0
 =========================================================

 * Product Page: http://www.creative-tim.com/product/light-bootstrap-dashboard-angular2
 * Copyright 2016 Creative Tim (http://www.creative-tim.com)
 * Licensed under MIT

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LbdSidebarComponent } from './lbd-sidebar/lbd-sidebar.component';
import { LbdNavbarComponent } from './lbd-navbar/lbd-navbar.component';
import { LbdFooterComponent } from './lbd-footer/lbd-footer.component';
import { LbdChartComponent } from './lbd-chart/lbd-chart.component';
import { LbdTaskListComponent } from './lbd-task-list/lbd-task-list.component';
import { NotificationService } from './services/notification.service';
import { LbdTableComponent } from './lbd-table/lbd-table.component';
import { LbdUserProfileComponent } from './lbd-user-profile/lbd-user-profile.component';
import { NavbarTitleService } from './services/navbar-title.service';
import { LbdCheckboxComponent } from './lbd-checkbox/lbd-checkbox.component';
import { MobileSidebarToggleService } from './services/mobile-sidebar-toggle.service';
import { LbdCloseLayerComponent } from './lbd-close-layer/lbd-close-layer.component';
import { LbdNavbarItemsComponent } from './lbd-navbar-items/lbd-navbar-items.component';
import { LbdSidebarItemsComponent } from './lbd-sidebar-items/lbd-sidebar-items.component';
import { NgPipesModule } from 'ngx-pipes';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';


@NgModule({
  imports: [
    CommonModule,
    RouterModule, 
    NgPipesModule
  ],
  providers: [NotificationService, NavbarTitleService, MobileSidebarToggleService, UserService, AuthService],
  declarations: [
    LbdSidebarComponent,
    LbdNavbarComponent,
    LbdFooterComponent,
    LbdChartComponent,
    LbdTaskListComponent,
    LbdTableComponent,
    LbdUserProfileComponent,
    LbdCheckboxComponent,
    LbdCloseLayerComponent,
    LbdNavbarItemsComponent,
    LbdSidebarItemsComponent,
  ],
  exports: [
    LbdSidebarComponent,
    LbdNavbarComponent,
    LbdFooterComponent,
    LbdChartComponent,
    LbdTaskListComponent,
    LbdTableComponent,
    LbdUserProfileComponent,
    LbdCheckboxComponent,
    LbdCloseLayerComponent,
    LbdNavbarItemsComponent,
    LbdSidebarItemsComponent,
  ]
})
export class LbdModule { }
