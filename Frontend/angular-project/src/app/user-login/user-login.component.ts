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
      next:token=>{
        const tokenDecoded:{id:number} = jwtDecode(token);
        this.usersService.getUser(tokenDecoded.id).subscribe(u=>this.authService.setData(token, u));
      },
      error:e=>this.addAlert(e.error.error)
    })
  }

  addAlert(texto:string){
    const div = document.getElementById("alertLogin");
    const alert = document.createElement("div");
    alert.className = "alert alert-dismissible alert-danger offset-md-3 col-md-6 fade show";
    const icon = document.createElement("i");
    icon.className = "fa-solid fa-circle-xmark";
    const close = document.createElement("button");
    close.className = "btn-close";
    close.setAttribute("type", "button");
    close.setAttribute("data-bs-dismiss", "alert");
    alert.appendChild(icon);
    alert.appendChild(close);
    alert.appendChild(document.createTextNode(" "+texto));
    div?.insertBefore(alert, div.lastChild);
  }
}
