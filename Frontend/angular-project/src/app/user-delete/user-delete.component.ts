import { Component, OnInit } from '@angular/core';
import { IUser } from '../interfaces/i-user';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'user-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.css']
})
export class UserDeleteComponent implements OnInit {
  user!:IUser;
  constructor(private router: Router, private usersService: UsersService, private authService:AuthService) {}

  ngOnInit() {
    this.user = this.authService.getUser();
  }

  deleteUsuario(){
    this.usersService.deleteUser(this.user.id).subscribe({
      next:()=>this.logout()
    })
  }

  logout(){
    if (this.authService.logout()) this.router.navigate(['/inicio'])
  }

}
