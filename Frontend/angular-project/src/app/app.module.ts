import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { RepiceListComponent } from './repice-list/repice-list.component';
import { RepiceItemComponent } from './repice-item/repice-item.component';
import { RepiceDetailComponent } from './repice-detail/repice-detail.component';
import { RouterModule } from '@angular/router';
import { APP_ROUTES } from './app.routes';
import { WelcomeComponent } from './welcome/welcome.component';
import { RepicesService } from './services/repices.service';
import { AuthService } from './services/auth.service';
import { BaseUrlInterceptor } from './interceptores/base-url.interceptor';
import { UserListComponent } from './user-list/user-list.component';
import { NeedsComponent } from './needs/needs.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserAddComponent } from './user-add/user-add.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UserUpdateComponent } from './user-update/user-update.component';
import { UserPasswordComponent } from './user-password/user-password.component';
import { UserDeleteComponent } from './user-delete/user-delete.component';
import { RepiceManagementComponent } from './repice-management/repice-management.component';

import localeEs from '@angular/common/locales/es';
import {registerLocaleData} from '@angular/common';
registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    RepiceListComponent,
    RepiceItemComponent,
    WelcomeComponent,
    RepiceDetailComponent,
    UserListComponent,
    UserAddComponent,
    UserLoginComponent,
    UserInfoComponent,
    NavbarComponent,
    UserUpdateComponent,
    UserPasswordComponent,
    NeedsComponent,
    UserDeleteComponent,
    RepiceManagementComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    RouterModule.forRoot(APP_ROUTES, {
      anchorScrolling: 'enabled'
    })
  ],
  providers: [
    RepicesService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BaseUrlInterceptor,
      multi: true,
    },
    {provide: LOCALE_ID, useValue: "es"},
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
