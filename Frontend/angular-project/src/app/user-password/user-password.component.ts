import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IUser, IUserPass } from '../interfaces/i-user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'user-password',
  templateUrl: './user-password.component.html',
  styleUrls: ['./user-password.component.css']
})
export class UserPasswordComponent implements OnInit {
  @Input() user!:IUser;
  @Output() modificarUsuario = new EventEmitter<IUser>();
  userPass!:IUserPass;
  new_pass = '';
  passwordIncorrecto = false;

  constructor(private authService:AuthService) {}

  ngOnInit(): void {
    this.initUser(this.user);
  }

  initUser(usuario:IUser) {
    this.userPass = {
      usuario: usuario.usuario,
      password: '',
      new_password: ''
    };
  }

  changePassword() {
    if (this.new_pass != this.userPass.new_password) {
      this.addAlert(false, "Las contraseñas no coinciden");
      console.log(this.new_pass);
      console.log(this.userPass.new_password);
    }
    else {
      this.authService.changePassword(this.userPass).subscribe({
        next:respu=>{
          this.user.password = respu;
          this.modificarUsuario.emit(this.user);
          this.authService.setUser(this.user);
          this.reset();
          this.addAlert(true, "Contraseña cambiada correctamente");
          console.log(respu)
        },
        error:e=>{
          if (e.error.error != undefined) this.addAlert(false, e.error.error);
          if (e.error.errors != undefined) this.addAlert(false, "La nueva contraseña no tiene el formato correcto");
          this.new_pass = "";
          console.log(e);
        }
      });
    }
  }

  reset() {
    this.initUser(this.user);
    this.new_pass = '';
  }
  addAlert(correcto:boolean, texto:string){
    const div = document.getElementById("alertPass");
    const alert = document.createElement("div");
    alert.className = "alert alert-dismissible "+((correcto)?"alert-primary":"alert-danger")+" offset-md-5 col-md-7 fade show";
    const icon = document.createElement("i");
    icon.className = "fa-solid fa-circle-"+((correcto)?"check":"xmark");
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
