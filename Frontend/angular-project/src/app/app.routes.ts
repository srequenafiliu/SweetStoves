import { Route } from "@angular/router";
import { RepiceDetailComponent } from "./repice-detail/repice-detail.component";
import { RepiceListComponent } from "./repice-list/repice-list.component";
import { UserAddComponent } from "./user-add/user-add.component";
import { UserInfoComponent } from "./user-info/user-info.component";
import { UserListComponent } from "./user-list/user-list.component";
import { UserLoginComponent } from "./user-login/user-login.component";
import { WelcomeComponent } from "./welcome/welcome.component";
import { NeedsComponent } from "./needs/needs.component";

export const APP_ROUTES:Route[]=[
  { path: 'inicio', component: WelcomeComponent },
  { path: 'recetas', component: RepiceListComponent },
  // :id es un parámetro (id de la receta)
  { path: 'receta/:id', component: RepiceDetailComponent },
  { path: 'usuarios', component: UserListComponent },
  { path: 'necesidades-especiales', component: NeedsComponent },
  { path: 'login', component: UserLoginComponent },
  { path: 'registro', component: UserAddComponent },
  { path: 'perfil-usuario', component: UserInfoComponent }
];
