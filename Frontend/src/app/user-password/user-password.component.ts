import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'user-password',
  templateUrl: './user-password.component.html',
  styleUrls: ['./user-password.component.css']
})
export class UserPasswordComponent {
  user = this.authService.getUser();
  userPass = this.initUserPass();
  new_pass = '';
  passwordIncorrecto = false;

  constructor(private authService:AuthService) {}

  initUserPass() {
    return {
      usuario: this.user.usuario,
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
    this.userPass = this.initUserPass();
    this.new_pass = '';
  }
}
