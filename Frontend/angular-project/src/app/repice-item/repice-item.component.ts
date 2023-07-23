import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IRepice } from '../interfaces/i-repice';
import { RepicesService } from '../services/repices.service';
import { AuthService } from '../services/auth.service';
import { IUser } from '../interfaces/i-user';

@Component({
  selector: 'repice-item',
  templateUrl: './repice-item.component.html',
  styleUrls: ['./repice-item.component.css']
})
export class RepiceItemComponent {
  @Input() repice!:IRepice;
  @Output() deleteRepice = new EventEmitter();
  constructor(private repicesService:RepicesService, private router : Router, private authService:AuthService) {}

  cuentaUsuario = ():boolean => this.router.url.includes('/perfil-usuario') && this.authService.getUser().usuario === this.repice.usuario.usuario;

  borrarReceta(){
    this.repicesService.deleteRepice(this.repice.id).subscribe({
      next:()=>{
        this.deleteRepice.emit();
        const usuario:IUser = this.authService.getUser();
        usuario.recetas = usuario.recetas?.filter(r=>r.id!=this.repice.id);
        usuario.recetas_seguidas = usuario.recetas_seguidas?.filter(r=>r.id!=this.repice.id);
        this.authService.setUser(usuario);
      }})
  }
}
