import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../global.service';
import { IRepice } from '../interfaces/i-repice';
import { IUser } from '../interfaces/i-user';
import { RepicesService } from '../services/repices.service';
import { UsersService } from '../services/users.service';

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
    public globalService: GlobalService
  ) {}
  recetas:IRepice[] = [];
  recetas_seguidas:IRepice[] = [];

  ngOnInit() {
    this.user = this.globalService.user;
    this.globalService.user.recetas?.map(receta=>receta.id).forEach(r=>this.repicesService.getRepice(r).subscribe({
      next:(u) => (this.recetas.push(u)),
      error:(error) => console.error(error)
    })),
    this.globalService.user.recetas_seguidas?.map(receta=>receta.id).forEach(r=>this.repicesService.getRepice(r).subscribe({
      next:(u) => (this.recetas_seguidas.push(u)),
      error:(error) => console.error(error)
    }))
  }

  lista = false;
  recetaNueva = false;
  actualizarDatos= false;
  borrarUsuario=false;
  mostrarLista(){
    this.lista = true;
    this.recetaNueva = false;
    this.actualizarDatos= false;
    this.borrarUsuario=false;
  }
  mostrarAdd(){
    this.lista = false;
    this.recetaNueva = true;
    this.actualizarDatos= false;
    this.borrarUsuario=false;
  }
  mostrarUpdate(){
    this.lista = false;
    this.recetaNueva = false;
    this.actualizarDatos= true;
    this.borrarUsuario=false;
  }
  mostrarBorrado(){
    this.lista = false;
    this.recetaNueva = false;
    this.actualizarDatos= false;
    this.borrarUsuario=true;
  }
  addNewRepice(recetaNueva:IRepice){
    this.recetas.push(recetaNueva);
  }
  modificarUsuario(updateUser:IUser){
    this.user = updateUser;
  }
  deleteUsuario(){
    this.usersService.deleteUser(this.user.id).subscribe({
      next:respu=>{this.routeDirecto.navigate(['/usuarios']);console.log(respu)},
      error:e=>console.log(e)
    })
  }
  borrarReceta(receta:IRepice){
    this.recetas = this.recetas.filter(r=>r!=receta)
  }

  logout(){
    this.globalService.logged = false;
    this.routeDirecto.navigate(['/inicio'])
  }
}
