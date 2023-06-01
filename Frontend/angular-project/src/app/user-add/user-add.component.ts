import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '../interfaces/i-user';
import { UsersService } from '../services/users.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit {
  newPassword = '';
  newUser!:IUser;
  users:IUser[] = [];

  constructor(private usersService:UsersService, private authService:AuthService, private routeDirecto: Router) {}
  ngOnInit(): void {
    this.initUser();
    this.usersService.getUsers().subscribe(u=>this.users=u);
  }

  initUser() {
    this.newUser = {
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
    for(let user of this.users) if (user.usuario == usuario) return true;
    return false;
  }

  changeImage(fileInput:HTMLInputElement) {
    if (!fileInput.files || fileInput.files.length === 0) this.newUser.imagen = null;
    else {
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(fileInput.files[0]);
      reader.addEventListener('loadend', () => this.newUser.imagen = reader.result as string);
    }
  }

  addUser(newUser:IUser, fileImage:HTMLInputElement) {
    this.authService.addUser(newUser).subscribe({
      next:respu=>{this.users.push(newUser);console.log(respu)},
      error:e=>console.log(e)
    });
    this.reset(fileImage);
    this.goBack();
  }
  reset(fileImage:HTMLInputElement){
    this.initUser();
    this.newPassword = '';
    fileImage.value = '';
  }
  goBack(){
    this.routeDirecto.navigate(['/inicio']);
  }
}
