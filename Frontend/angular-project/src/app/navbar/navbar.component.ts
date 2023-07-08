import { Component, DoCheck } from '@angular/core';
import { IUser } from '../interfaces/i-user';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, IsActiveMatchOptions, Router } from '@angular/router';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements DoCheck {
  user!:IUser;
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

  constructor(private authService:AuthService, private router:Router, private route:ActivatedRoute) {}

  ngDoCheck() {
    this.authService.checkToken(this.authService.getToken());
    this.user = this.authService.getUser();
  }

  isLinkActive = (link:string) => this.router.url.includes('/'+link);

  searchRepice() {
    this.router.navigate(["/recetas"], {queryParams: {nombre: this.search}});
    this.search = "";
  }
}
