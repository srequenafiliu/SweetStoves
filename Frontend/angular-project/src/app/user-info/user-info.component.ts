import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IRepice } from '../interfaces/i-repice';
import { IUser } from '../interfaces/i-user';
import { UsersService } from '../services/users.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  user!:IUser;
  opciones:{titulo:string, color:string, link:string, texto:string}[] = [
    {titulo:'Tu lista de recetas', color:'btn-outline-secondary', link:'recetas', texto:'Comprueba las recetas que has creado y seguido'},
    {titulo:'Nueva receta', color:'btn-outline-success', link:'nueva-receta', texto:'Crea una nueva receta que se vinculará a tu cuenta'},
    {titulo:'Actualiza tus recetas', color:'btn-outline-info', link:'actualizar-receta', texto:'Actualiza cualquiera de tus recetas'},
    {titulo:'Actualiza tu cuenta', color:'btn-outline-warning', link:'actualizar-cuenta', texto:'Actualiza los datos de tu cuenta excepto tu contraseña'},
    {titulo:'Cambia tu contraseña', color:'btn-outline-dark', link:'actualizar-password', texto:'Cambia tu contraseña para hacer tu cuenta más segura'},
    {titulo:'Borra tu cuenta', color:'btn-outline-danger', link:'borrar-cuenta', texto:'Puedes borrar tu cuenta sin compromiso, pero te echaremos de menos'}
  ];

  constructor(private router: Router, private usersService: UsersService,
    private authService:AuthService) {}

  ngOnInit() {
    this.user = this.authService.getUser();
  }

  addNewRepice = (recetaNueva:IRepice) => console.log(recetaNueva);

  updateRepice = (recetaAct:IRepice) => console.log(recetaAct);

  modificarUsuario = (updateUser:IUser) => this.user = updateUser;

  logout(){
    if (this.authService.logout()) this.router.navigate(['/inicio'])
  }
}
