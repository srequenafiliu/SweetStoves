import { Component, OnInit } from '@angular/core';
import { IsActiveMatchOptions, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { IUser } from '../interfaces/i-user';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user:IUser|null = null;
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

  subscription?: Subscription;
  constructor(private usersService:UsersService, protected authService:AuthService, private router:Router) {
    this.subscription = authService.getData().subscribe(u=>this.user = u)
  }

  ngOnInit(): void {
    if (this.authService.getToken()) this.usersService.getUser().subscribe(u => this.user = u)
  }

  searchRepice() {
    this.router.navigate(["/recetas"], {queryParams: {nombre: this.search}});
    this.search = "";
  }
}
