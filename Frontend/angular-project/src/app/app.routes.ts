import { Route } from "@angular/router";
import { RepiceDetailComponent } from "./repice-detail/repice-detail.component";
import { RepiceListComponent } from "./repice-list/repice-list.component";
import { UserAddComponent } from "./user-add/user-add.component";
import { UserInfoComponent } from "./user-info/user-info.component";
import { UserListComponent } from "./user-list/user-list.component";
import { UserLoginComponent } from "./user-login/user-login.component";
import { WelcomeComponent } from "./welcome/welcome.component";

export const APP_ROUTES:Route[]=[
  { path: 'inicio', component: WelcomeComponent },
  { path: 'recetas', component: RepiceListComponent },
  // :id es un parámetro (id de la receta)
  { path: 'recetas/:id', component: RepiceDetailComponent },
  { path: 'usuarios', component: UserListComponent },
  { path: 'login', component: UserLoginComponent },
  { path: 'registro', component: UserAddComponent },
  { path: 'perfil_usuario', component: UserInfoComponent },
  // Ruta por defecto (vacía) -> Redirigir a /inicio
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  // Ruta que no coincide con ninguna de las anteriores
  { path: '**', redirectTo: '/inicio', pathMatch: 'full' }
];
