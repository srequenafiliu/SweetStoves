import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RepiceListComponent } from './repice-list/repice-list.component';
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
import { noUserGuard } from './guards/no-user.guard';
import { userGuard } from './guards/user.guard';

const routes: Routes = [
  { path: 'inicio', component: HomeComponent, title: "SweetStoves" },
  { path: 'recetas', component: RepiceListComponent, title: "SweetStoves | Recetas" },
  { path: 'recetas/:id', component: RepiceDetailComponent, title: "SweetStoves | Recetas:" }, // :id es un parámetro (id de la receta)
  { path: 'usuarios', component: UserListComponent, title: "SweetStoves | Usuarios" },
  { path: 'necesidades-especiales', component: NeedsComponent, title: "SweetStoves | Necesidades especiales" },
  { path: 'login', component: UserLoginComponent, title: "SweetStoves | Inicio de sesión", canActivate: [noUserGuard] },
  { path: 'registro', component: UserAddComponent, title: "SweetStoves | Registro", canActivate: [noUserGuard] },
  { path: 'perfil-usuario', component: UserInfoComponent, title: "SweetStoves | Perfil del usuario", canActivate: [userGuard], children: [
    { path: 'recetas', component: RepiceListComponent },
    { path: "nueva-receta", component: RepiceManagementComponent },
    { path: "actualizar-receta", component: RepiceManagementComponent },
    { path: "actualizar-cuenta", component: UserUpdateComponent },
    { path: "actualizar-password", component: UserPasswordComponent },
    { path: "borrar-cuenta", component: UserDeleteComponent },
    { path: '', redirectTo: 'recetas', pathMatch: 'full' },
    { path: '**', redirectTo: 'recetas', pathMatch: 'full' }
  ] },
  { path: '', redirectTo: '/inicio', pathMatch: 'full' }, // Ruta por defecto (vacía)
  { path: '**', redirectTo: '/inicio', pathMatch: 'full' } // Ruta que no coincide con ninguna de las anteriores
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
