import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IUser } from '../interfaces/i-user';
import { UsersService } from '../services/users.service';
import { GlobalService } from '../global.service';

@Component({
  selector: 'user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent implements OnInit {
  @Input() user!:IUser;
  nuevoApellido!:string;
  nuevoTelefono!:string;
  newPassword = '';
  userUpdate!:IUser;
  users:IUser[] = [];

  constructor(private usersService:UsersService, public globalService:GlobalService) {}
  ngOnInit(): void {
    this.initUser(this.user);
    this.usersService.getUsers().subscribe(u=>this.users=u);
  }

  initUser(usuario:IUser) {
    this.userUpdate = {
      id: usuario.id,
      usuario: usuario.usuario,
      correo: usuario.correo,
      password: usuario.password,
      imagen: null,
      datosUsuario: {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        nombre: usuario.datosUsuario!.nombre,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        apellido: usuario.datosUsuario!.apellido,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        telefono: usuario.datosUsuario!.telefono
      },
      recetas: []
    };
    this.nuevoApellido = (typeof usuario.datosUsuario?.apellido == 'string') ? usuario.datosUsuario.apellido : '';
    this.nuevoTelefono = (typeof usuario.datosUsuario?.telefono == 'string') ? usuario.datosUsuario.telefono : '';
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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.userUpdate.datosUsuario!.apellido = (this.nuevoApellido == '') ? null: this.nuevoApellido;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.userUpdate.datosUsuario!.telefono = (this.nuevoTelefono == '') ? null: this.nuevoTelefono;
    this.usersService.updateUser(newUser).subscribe({
      next:respu=>{
        newUser.imagen = this.user.imagen;
        this.modificarUsuario.emit(newUser);
        this.user = newUser;
        this.globalService.user = newUser;
        this.reset(newUser, fileImage);
        console.log(respu)},
      error:e=>console.log(e)
    });
  }
  reset(newUser:IUser, fileImage:HTMLInputElement){
    if (fileImage.value!='') this.userUpdate.imagen = fileImage.value;
    this.initUser(newUser);
    this.newPassword = '';
    fileImage.value = '';
  }
}
