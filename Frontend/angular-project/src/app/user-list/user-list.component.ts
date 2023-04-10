import { Component, OnInit } from '@angular/core';
import { IUser } from '../interfaces/i-user';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  title = 'Lista de usuarios'
  headers = {imagen: 'Foto de perfil', usuario: 'Usuario', nombre: 'Nombre', correo:'Correo electrónico', telefono:'Teléfono', recetas:'Recetas creadas'};
  users:IUser[] = [];
  constructor(private usersService:UsersService) {}
  ngOnInit(): void {
      this.usersService.getUsers().subscribe(u=>this.users=u);
  }
  getRecetas(user:IUser){
    return user.recetas?.length ? user.recetas?.map(r => r.nombre).join(', ') : 'Sin recetas';
  }
}
