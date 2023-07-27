import { Component } from '@angular/core';
import { IUser } from '../interfaces/i-user';
import { UsersService } from '../services/users.service';
import { AuthService } from '../services/auth.service';
import jwtDecode from 'jwt-decode';

@Component({
  selector: 'user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent {
  newPassword = '';
  newUser = this.initUser();
  errores:string[] = [];
  usuarioExistente = false;
  correoExistente = false;

  constructor(private usersService:UsersService, private authService:AuthService) {}

  initUser(): IUser {
    return {
      id: 0,
      usuario: '',
      correo: '',
      password: '',
      imagen: null,
      datosUsuario: {
        nombre: '',
        apellido: '',
        telefono: ''
      },
      recetas: []
    };
  }

  changeImage(fileInput:HTMLInputElement) {
    if (!fileInput.files || fileInput.files.length === 0) this.newUser.imagen = null;
    else {
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(fileInput.files[0]);
      reader.addEventListener('loadend', () => this.newUser.imagen = reader.result as string);
    }
  }

  addUser(newUser:IUser) {
    if (newUser.datosUsuario?.apellido == "") newUser.datosUsuario.apellido = null;
    if (newUser.datosUsuario?.telefono == "") newUser.datosUsuario.telefono = null;
    this.authService.addUser(newUser).subscribe({
      next:()=>{
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.authService.login({usuario: newUser.usuario, password: newUser.password!
        }).subscribe({
          next:token=>this.usersService.getUser(jwtDecode<{id:number}>(token).id).subscribe(u=>this.authService.setData(token, u))
        })
      },
      error:e=>{
        console.log(e.error.error);
        this.errores = (e.error.errores != undefined) ? e.error.errores : [];
        this.usuarioExistente = (e.error.error != undefined) ? e.error.error.includes("(usuario)") : false;
        this.correoExistente = (e.error.error != undefined) ? e.error.error.includes("(correo)") : false;
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
    this.newUser = this.initUser();
    this.errores = [];
    this.usuarioExistente = false;
    this.correoExistente = false;
    this.newPassword = '';
    fileImage.value = '';
  }
}
