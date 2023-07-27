import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { IsActiveMatchOptions, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  user = this.authService.getUser()
  search = "";
  navbar:{icon:string, link:string, titulo:string}[] = [
    {icon:'user-check', link:'/login', titulo:'Iniciar sesión'},
    {icon:'user-plus', link:'/registro', titulo:'Registrarse'}
  ];
  routerLinkActiveOptions: IsActiveMatchOptions = {
    matrixParams: 'ignored',
    queryParams: 'ignored',
    fragment: 'ignored',
    paths: 'exact'
  };

  subscription: Subscription;
  constructor(private authService:AuthService, private router:Router) {
    this.subscription = authService.getData().subscribe(u=>this.user = u)
  }

  searchRepice() {
    this.router.navigate(["/recetas"], {queryParams: {nombre: this.search}});
    this.search = "";
  }
}
