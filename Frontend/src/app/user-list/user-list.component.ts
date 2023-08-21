import { Component } from '@angular/core';
import { IUser } from '../interfaces/i-user';
import { UsersService } from '../services/users.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  pag!:number;
  innerWidth = window.innerWidth;
  size = (this.innerWidth>540) ? 6 : 3;
  count!:number;
  users!:IUser[];
  pages!:(string|number)[];
  constructor(private usersService:UsersService, private route:ActivatedRoute) {
    this.size = (window.innerWidth>540) ? 6 : 3;
    this.route.queryParams.subscribe(params => {
      this.pag = (+params["pag"]) ? +params["pag"] : 1;
      this.getUsuarios();
    })
  }

  getUsuarios() {
    this.usersService.getUsers(this.pag, this.size).subscribe({
      next: r=>{
        this.count = r.count;
        this.users = r.result;
        const length = Math.ceil(r.count/this.size);
        this.pages = (length>7) ? this.getPages(this.pag, length) : Array(length).fill(1).map((_x, i)=>i+1);
      },
      error: e=>document.getElementById("server_error_u")?.appendChild(document.createTextNode(e)),
    });
  }

  getPages(pagActual:number, length:number) {
    switch (pagActual) {
      case 1: case 2: case length-1: case length: return [1, 2, 3, '...', length-2, length-1, length];
      case 3: return [1, 2, 3, 4, '...', length-1, length];
      case length-2: return [1, 2, "...", length-3, length-2, length-1, length];
      default: return [1, (pagActual == 4) ? 2 : '...', pagActual-1, pagActual, pagActual+1, (pagActual == length-3) ? length-1 : '...', length];
    }
  }

  getRecetas = (user:IUser) => user.recetas?.length ? user.recetas?.map(r => r.nombre).join(', ') : 'Sin recetas';
}
