import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IRepiceDto } from '../interfaces/i-repice';
import { RepicesService } from '../services/repices.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'repice-item',
  templateUrl: './repice-item.component.html',
  styleUrls: ['./repice-item.component.css']
})
export class RepiceItemComponent {
  @Input() usuario!:String;
  @Input() repice!:IRepiceDto;
  @Output() deleteRepice = new EventEmitter();
  constructor(private repicesService:RepicesService, private router:Router) {}

  cuentaUsuario = ():boolean  => this.router.url.includes('/perfil-usuario') && this.usuario == this.repice.usuario;

  borrarReceta(){
    this.repicesService.deleteRepice(this.repice.id).subscribe(()=>this.deleteRepice.emit())
  }
}
