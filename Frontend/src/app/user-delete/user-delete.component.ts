import { Component } from '@angular/core';
import { UsersService } from '../services/users.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'user-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.css']
})
export class UserDeleteComponent {
  constructor(private usersService: UsersService, private authService:AuthService) {}

  deleteUsuario = () => this.usersService.deleteUser().subscribe(()=>this.authService.logout())
}
