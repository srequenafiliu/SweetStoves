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
    if (this.new_pass != this.userPass.new_password) this.authService.addAlert("alertPass", false, "Las contraseñas no coinciden", false);
    else {
      this.authService.changePassword(this.userPass).subscribe({
        next:respu=>{
          this.user.password = respu;
          this.modificarUsuario.emit(this.user);
          this.authService.setUser(this.user);
          this.reset();
          this.authService.addAlert("alertPass", true, "Contraseña cambiada correctamente", false);
        },
        error:e=>{
          if (e.error.error != undefined) this.authService.addAlert("alertPass", false, e.error.error, false);
          if (e.error.errors != undefined) this.authService.addAlert("alertPass", false, "La nueva contraseña no tiene el formato correcto", false);
          this.new_pass = "";
        }
      });
    }
  }

  reset() {
    this.initUser(this.user);
    this.new_pass = '';
  }
}
