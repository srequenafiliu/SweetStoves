import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RepiceListComponent } from './repice-list/repice-list.component';
import { RepiceItemComponent } from './repice-item/repice-item.component';
import { RepiceDetailComponent } from './repice-detail/repice-detail.component';
import { UserListComponent } from './user-list/user-list.component';
import { NeedsComponent } from './needs/needs.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserAddComponent } from './user-add/user-add.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { RepiceManagementComponent } from './repice-management/repice-management.component';
import { UserUpdateComponent } from './user-update/user-update.component';
import { UserPasswordComponent } from './user-password/user-password.component';
import { UserDeleteComponent } from './user-delete/user-delete.component';

import { BaseUrlInterceptor } from './interceptors/base-url.interceptor';

import localeEs from '@angular/common/locales/es';
import {registerLocaleData} from '@angular/common';
registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    RepiceListComponent,
    RepiceDetailComponent,
    UserListComponent,
    NeedsComponent,
    UserLoginComponent,
    UserAddComponent,
    UserInfoComponent,
    RepiceManagementComponent,
    UserUpdateComponent,
    UserPasswordComponent,
    UserDeleteComponent,
    RepiceItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BaseUrlInterceptor,
      multi: true,
    },
    {provide: LOCALE_ID, useValue: "es"}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
