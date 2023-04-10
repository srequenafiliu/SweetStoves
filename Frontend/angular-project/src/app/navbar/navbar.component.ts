import { Component, Input, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';
import { IUser } from '../interfaces/i-user';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input()title!: string;
  user!:IUser;
  logged!:boolean;

  constructor(public globalService: GlobalService) {}

  ngOnInit() {
    this.user = this.globalService.user;
  }
}
