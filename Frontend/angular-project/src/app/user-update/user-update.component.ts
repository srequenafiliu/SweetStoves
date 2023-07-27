import { Component } from '@angular/core';
import { IUser } from '../interfaces/i-user';
import { UsersService } from '../services/users.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent {
  user = this.authService.getUser();
  opcion = 'conservar';
  errores:string[] = [];
  usuarioExistente = false;
  correoExistente = false;
  password = '';
  passwordIncorrecto = false;

  constructor(private usersService:UsersService, private authService:AuthService) {}

  changeImage(fileInput:HTMLInputElement) {
    if (!fileInput.files || fileInput.files.length === 0) this.user.imagen = null;
    else {
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(fileInput.files[0]);
      reader.addEventListener('loadend', () => this.user.imagen = reader.result as string);
    }
  }

  updateUser(user:IUser, fileImage:HTMLInputElement) {
    const copia_usuario = Object.assign({}, user)
    if (this.opcion == "conservar") copia_usuario.imagen = null;
    else if (this.opcion == 'borrar') copia_usuario.imagen = this.opcion;
    if (copia_usuario.datosUsuario?.apellido == "") copia_usuario.datosUsuario.apellido = null;
    if (copia_usuario.datosUsuario?.telefono == "") copia_usuario.datosUsuario.telefono = null;
    copia_usuario.password = this.password;
    this.usersService.updateUser(copia_usuario).subscribe({
      next:respu=>{
        this.user = respu;
        this.authService.sendData(respu)
        this.authService.setUser(respu);
        this.reset(fileImage);
        this.authService.addAlert("alertUpdate", true, "Datos actualizados correctamente", false);
      },
      error:e=>{
        this.errores = (e.error.errores != undefined) ? e.error.errores : [];
        this.usuarioExistente = (e.error.error != undefined) ? e.error.error.includes("usuario_unique") : false;
        this.correoExistente = (e.error.error != undefined) ? e.error.error.includes("correo_unique") : false;
        this.passwordIncorrecto = (e.error.error != undefined) ? e.error.error.includes("Contraseña") : false;
        this.password = '';
      }
    });
  }

  buscarErrores(name:string):number {
    for (const i in this.errores) {
      if (this.errores[i].includes("datosUsuario.")) this.errores[i] = this.errores[i].replace("datosUsuario.", "");
      if (this.errores[i].includes("telefono")) this.errores[i] = this.errores[i].replace("telefono", "teléfono");
      if (this.errores[i].includes(name)) return +i;
    }
    return -1;
  }

  reset(fileImage:HTMLInputElement){
    this.user = this.authService.getUser()
    this.errores = [];
    this.usuarioExistente = false;
    this.correoExistente = false;
    this.passwordIncorrecto = false;
    this.password = '';
    fileImage.value = '';
  }
}
