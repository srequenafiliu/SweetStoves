import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { RepiceListComponent } from './repice-list/repice-list.component';
import { RepiceItemComponent } from './repice-item/repice-item.component';
import { DifficultyLevelComponent } from './difficulty-level/difficulty-level.component';
import { RepiceDetailComponent } from './repice-detail/repice-detail.component';
import { RouterModule } from '@angular/router';
import { APP_ROUTES } from './app.routes';
import { WelcomeComponent } from './welcome/welcome.component';
import { RepicesService } from './services/repices.service';
import { BaseUrlInterceptor } from './interceptores/base-url.interceptor';
import { UserListComponent } from './user-list/user-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserAddComponent } from './user-add/user-add.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RepiceAddComponent } from './repice-add/repice-add.component';
import { UserUpdateComponent } from './user-update/user-update.component';
import { UserPasswordComponent } from './user-password/user-password.component';
import { RepiceUpdateComponent } from './repice-update/repice-update.component';

@NgModule({
  declarations: [
    AppComponent,
    RepiceListComponent,
    RepiceItemComponent,
    DifficultyLevelComponent,
    WelcomeComponent,
    RepiceDetailComponent,
    UserListComponent,
    UserAddComponent,
    UserLoginComponent,
    UserInfoComponent,
    NavbarComponent,
    RepiceAddComponent,
    UserUpdateComponent,
    UserPasswordComponent,
    RepiceUpdateComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    RouterModule.forRoot(APP_ROUTES)
  ],
  providers: [
    RepicesService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BaseUrlInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
