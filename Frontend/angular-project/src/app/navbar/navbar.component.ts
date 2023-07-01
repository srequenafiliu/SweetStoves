import { Component, DoCheck } from '@angular/core';
import { IUser } from '../interfaces/i-user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements DoCheck {
  user!:IUser;
  navbar_menu:{link:string, titulo:string}[] = [
    {link:'/inicio', titulo:'Inicio'},
    {link:'/recetas', titulo:'Recetas'},
    {link:'/usuarios', titulo:'Usuarios'}
  ];
  navbar_user:{icon:string, link:string, titulo:string}[] = [
    {icon:'user-check', link:'/login', titulo:'Iniciar sesión'},
    {icon:'user-plus', link:'/registro', titulo:'Registrarse'}
  ];

  constructor(private authService:AuthService) {}

  ngDoCheck() {
    this.authService.checkToken(this.authService.getToken());
    this.user = this.authService.getUser();
  }
}
