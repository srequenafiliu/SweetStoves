import { Component } from '@angular/core';
import { UsersService } from '../services/users.service';
import { AuthService } from '../services/auth.service';
import jwtDecode from 'jwt-decode';
import { ILogin } from '../interfaces/i-login';

@Component({
  selector: 'user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent {

  userLogin:ILogin = {
    usuario: '',
    password: ''
  }

  constructor(private usersService:UsersService, private authService:AuthService) {}

  login() {
    this.authService.login(this.userLogin).subscribe({
      next:token=>this.usersService.getUser(jwtDecode<{id:number}>(token).id).subscribe(u=>this.authService.setData(token, u)),
      error:e=>this.authService.addAlert("alertLogin", false, e.error.error, true)
    })
  }
}
