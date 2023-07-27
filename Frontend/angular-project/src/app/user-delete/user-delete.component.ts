import { Component } from '@angular/core';
import { UsersService } from '../services/users.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'user-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.css']
})
export class UserDeleteComponent {
  user = this.authService.getUser();
  constructor(private usersService: UsersService, private authService:AuthService) {}

  deleteUsuario(){
    this.usersService.deleteUser(this.user.id).subscribe({
      next:()=>this.authService.logout()
    })
  }
}
