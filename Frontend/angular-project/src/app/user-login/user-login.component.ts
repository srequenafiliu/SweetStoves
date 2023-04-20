import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../global.service';
import { IUser } from '../interfaces/i-user';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {
  nameUser = '';
  userLogin!:IUser;
  passwordLogin = '';
  users:IUser[] = [];

  constructor(private usersService:UsersService, private router:Router, public globalService:GlobalService) {}
  ngOnInit(): void {
    this.initUser();
    this.usersService.getUsers().subscribe(u=>this.users=u);
  }

  initUser() {
    this.userLogin = {
      id: 0,
      usuario: '',
      correo: '',
      password: '',
      imagen: '',
      datosUsuario: {
        nombre: '',
        apellido: '',
        telefono: ''
      },
      recetas: []
    };
  }

  usuarioExistente(usuario:string):boolean {
    // eslint-disable-next-line prefer-const
    for(let user of this.users) if (user.usuario == usuario) return true;
    return false;
  }

  getUsuario(usuario:string) {
    // eslint-disable-next-line prefer-const
    for(let user of this.users) if (user.usuario == usuario) this.userLogin=user;
  }

  login() {
    this.globalService.id = this.userLogin.id;
    this.globalService.usuario = this.userLogin.usuario;
    this.globalService.user = this.userLogin;
    this.globalService.logged = true;
    this.router.navigate(['/perfil_usuario']);
  }
}
