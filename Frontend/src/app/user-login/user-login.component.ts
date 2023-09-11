import { Component } from '@angular/core';
import { ILogin } from '../interfaces/i-login';
import { UsersService } from '../services/users.service';
import { AuthService } from '../services/auth.service';

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
      next:token=>{
        this.authService.setToken(token);
        this.usersService.getUser().subscribe(u=>this.authService.setData(u));
      },
      error:e=>this.authService.addAlert("alertLogin", false, e.error.error, true)
    })
  }
}
