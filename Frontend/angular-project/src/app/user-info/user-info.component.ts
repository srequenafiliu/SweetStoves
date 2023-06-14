import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IRepice } from '../interfaces/i-repice';
import { IUser } from '../interfaces/i-user';
import { RepicesService } from '../services/repices.service';
import { UsersService } from '../services/users.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  user!:IUser;
  constructor(
    private usersService: UsersService,
    private repicesService: RepicesService,
    private routeDirecto: Router,
    private authService:AuthService
  ) {}
  recetas:IRepice[] = [];
  recetas_seguidas:IRepice[] = [];
  mostrar = "";

  ngOnInit() {
    this.user = this.authService.getUser();
    this.user.recetas?.map(receta=>receta.id).forEach(r=>this.repicesService.getRepice(r).subscribe({
      next:u => this.recetas.push(u)
    })),
    this.user.recetas_seguidas?.map(receta=>receta.id).forEach(r=>this.repicesService.getRepice(r).subscribe({
      next:u => this.recetas_seguidas.push(u)
    }))
  }
  addNewRepice(recetaNueva:IRepice){
    this.recetas.push(recetaNueva);
  }
  modificarUsuario(updateUser:IUser){
    this.user = updateUser;
  }
  deleteUsuario(){
    this.usersService.deleteUser(this.user.id).subscribe({
      next:()=>this.routeDirecto.navigate(['/usuarios'])
    })
  }
  borrarReceta(receta:IRepice){
    this.recetas = this.recetas.filter(r=>r!=receta)
  }

  logout(){
    if (this.authService.logout()) this.routeDirecto.navigate(['/inicio'])
  }
}
