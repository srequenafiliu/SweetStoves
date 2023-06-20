import { Component, DoCheck, Input } from '@angular/core';
import { IUser } from '../interfaces/i-user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements DoCheck {
  @Input()title!: string;
  user!:IUser;

  constructor(private authService:AuthService) {}

  ngDoCheck() {
    this.authService.checkToken(this.authService.getToken());
    this.user = this.authService.getUser();
  }
}
