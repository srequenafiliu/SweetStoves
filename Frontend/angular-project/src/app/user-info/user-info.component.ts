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
  recetas_seguidas:IRepice[] = [];
  mostrar = "lista";

  constructor(private routeDirecto: Router, private usersService: UsersService,
    private repicesService: RepicesService, private authService:AuthService) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    this.user.recetas_seguidas?.map(receta=>receta.id).forEach(r=>this.repicesService.getRepice(r).subscribe({
      next:u => this.recetas_seguidas.push(u)
    }))
  }
  addNewRepice(recetaNueva:IRepice){
    this.recetas_seguidas.push(recetaNueva);
  }
  modificarUsuario(updateUser:IUser){
    this.user = updateUser;
  }
  deleteUsuario(){
    this.usersService.deleteUser(this.user.id).subscribe({
      next:()=>this.logout()
    })
  }
  borrarReceta(receta:IRepice){
    this.recetas_seguidas = this.recetas_seguidas.filter(r=>r!=receta)
  }
  logout(){
    if (this.authService.logout()) this.routeDirecto.navigate(['/inicio'])
  }
}
