import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '../interfaces/i-user';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent implements OnInit {
  @Input() user!:IUser;
  newPassword = '';
  userUpdate!:IUser;
  users:IUser[] = [];

  constructor(private usersService:UsersService, private routeDirecto: Router) {}
  ngOnInit(): void {
    this.initUser();
    this.usersService.getUsers().subscribe(u=>this.users=u);
  }

  initUser() {
    this.userUpdate = {
      id: this.user.id,
      usuario: this.user.usuario,
      correo: this.user.correo,
      password: this.user.password,
      imagen: null,
      datosUsuario: {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        nombre: this.user.datosUsuario!.nombre,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        apellido: this.user.datosUsuario!.apellido,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        telefono: this.user.datosUsuario!.telefono
      },
      recetas: []
    };
  }

  validarApellido(apellido:string):boolean {
    if (apellido) return apellido.match('^\\D+$') ? true :false;
    else return false;
  }

  validarTelefono(telefono:string):boolean {
    if (telefono) return telefono.match('\\d{9}') ? true :false;
    else return false;
  }

  usuarioExistente(usuario:string):boolean {
    // eslint-disable-next-line prefer-const
    for(let user of this.users) if (user.usuario == usuario && this.userUpdate.id != user.id) return true;
    return false;
  }

  changeImage(fileInput:HTMLInputElement) {
    if (!fileInput.files || fileInput.files.length === 0) this.userUpdate.imagen = null;
    else {
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(fileInput.files[0]);
      reader.addEventListener('loadend', () => this.userUpdate.imagen = reader.result as string);
    }
  }

  @Output() modificarUsuario = new EventEmitter<IUser>();
  updateUser(newUser:IUser, fileImage:HTMLInputElement) {
    if (fileImage.value!='') newUser.imagen = fileImage.value;
    this.usersService.updateUser(newUser).subscribe({
      next:respu=>{
        newUser.imagen = this.user.imagen;this.modificarUsuario.emit(newUser);console.log(respu)},
      error:e=>console.log(e)
    });
    this.reset(fileImage);
  }
  reset(fileImage:HTMLInputElement){
    if (fileImage.value!='') this.userUpdate.imagen = fileImage.value;
    this.initUser();
    this.newPassword = '';
    fileImage.value = '';
  }
}
