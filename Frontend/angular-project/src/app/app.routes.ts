import { Route } from "@angular/router";
import { RepiceDetailComponent } from "./repice-detail/repice-detail.component";
import { RepiceListComponent } from "./repice-list/repice-list.component";
import { UserAddComponent } from "./user-add/user-add.component";
import { UserInfoComponent } from "./user-info/user-info.component";
import { UserListComponent } from "./user-list/user-list.component";
import { UserLoginComponent } from "./user-login/user-login.component";
import { WelcomeComponent } from "./welcome/welcome.component";
import { NeedsComponent } from "./needs/needs.component";
import { RepiceAddComponent } from "./repice-add/repice-add.component";
import { RepiceUpdateComponent } from "./repice-update/repice-update.component";
import { UserUpdateComponent } from "./user-update/user-update.component";
import { UserPasswordComponent } from "./user-password/user-password.component";
import { UserDeleteComponent } from "./user-delete/user-delete.component";

export const APP_ROUTES:Route[]=[
  { path: 'inicio', component: WelcomeComponent, title: "SweetStoves" },
  { path: 'recetas', component: RepiceListComponent, title: "SweetStoves | Recetas" },
  { path: 'recetas/:id', component: RepiceDetailComponent, title: "SweetStoves | Recetas:" }, // :id es un parámetro (id de la receta)
  { path: 'usuarios', component: UserListComponent, title: "SweetStoves | Usuarios" },
  { path: 'necesidades-especiales', component: NeedsComponent, title: "SweetStoves | Necesidades especiales" },
  { path: 'login', component: UserLoginComponent, title: "SweetStoves | Inicio de sesión" },
  { path: 'registro', component: UserAddComponent, title: "SweetStoves | Registro" },
  { path: 'perfil-usuario', component: UserInfoComponent, title: "SweetStoves | Perfil del usuario", children: [
    { path: 'recetas', component: RepiceListComponent },
    { path: "nueva-receta", component: RepiceAddComponent },
    { path: "actualizar-receta", component: RepiceUpdateComponent },
    { path: "actualizar-cuenta", component: UserUpdateComponent },
    { path: "actualizar-password", component: UserPasswordComponent },
    { path: "borrar-cuenta", component: UserDeleteComponent },
    { path: '', redirectTo: 'recetas', pathMatch: 'full' },
    { path: '**', redirectTo: 'recetas', pathMatch: 'full' }
  ] },
  { path: '', redirectTo: '/inicio', pathMatch: 'full' }, // Ruta por defecto (vacía)
  { path: '**', redirectTo: '/inicio', pathMatch: 'full' } // Ruta que no coincide con ninguna de las anteriores
];
