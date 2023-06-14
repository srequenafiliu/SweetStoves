import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IRepice } from '../interfaces/i-repice';
import { RepicesService } from '../services/repices.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'repice-item',
  templateUrl: './repice-item.component.html',
  styleUrls: ['./repice-item.component.css']
})
export class RepiceItemComponent {
  @Input() repice!:IRepice;
  constructor(private repicesService:RepicesService, private router : Router, private authService:AuthService) {}
  cuentaUsuario():boolean{
    return this.router.url !== '/recetas' && this.authService.getUser().usuario === this.repice.usuario.usuario;
  }
  @Output() deleteRepice = new EventEmitter<IRepice>();
  borrarReceta(){
    this.repicesService.deleteRepice(this.repice.id).subscribe({
      next:()=>this.deleteRepice.emit(this.repice)
    })
  }
}
