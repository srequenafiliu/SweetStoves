import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { AuthService } from '../services/auth.service';
import jwtDecode from 'jwt-decode';
import { ILogin } from '../interfaces/i-login';

@Component({
  selector: 'user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  userLogin:ILogin = {
    usuario: '',
    password: ''
  }
  invalidPassword = false;
  usernames:string[] = [];

  constructor(private usersService:UsersService, private authService:AuthService, private router:Router) {}

  ngOnInit(): void {
    this.usersService.getUsers().subscribe(u=>{
      for (const user of u) this.usernames.push(user.usuario);
    });
  }

  usuarioExistente(usuario:string):boolean {
    return this.usernames.includes(usuario);
  }

  login() {
    this.authService.login(this.userLogin).subscribe({
      next:user=>{
        const tokenDecoded:{id:number} = jwtDecode(user.accessToken);
        this.usersService.getUser(tokenDecoded.id).subscribe(u=>this.authService.setData(user.accessToken, u));
      },
      error:()=>this.invalidPassword = true
    })
  }
}
