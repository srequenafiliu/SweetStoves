import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IRepice } from '../interfaces/i-repice';
import { RepicesService } from '../services/repices.service';
import { Location } from '@angular/common';
import { IUser } from '../interfaces/i-user';
import { AuthService } from '../services/auth.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'repice-detail',
  templateUrl: './repice-detail.component.html',
  styleUrls: ['./repice-detail.component.css']
})
export class RepiceDetailComponent implements OnInit {
  repice!:IRepice;
  user:IUser = this.authService.getUser();
  receta_creada?:boolean;
  guardado?:boolean;

  constructor(protected location: Location, private repicesService: RepicesService,
    private authService:AuthService, private route: ActivatedRoute, private titleService: Title) {}

  ngOnInit() {
    this.repicesService.getRepice(+this.route.snapshot.params['id']).subscribe({
      next:p => {
        this.repice = p;
        this.titleService.setTitle(this.titleService.getTitle()+" "+p.nombre)
        this.receta_creada = this.user.recetas?.map(rec => rec.id).includes(p.id);
        this.guardado = this.user.recetas_seguidas?.map(rec => rec.id).includes(p.id);
      }
    });
  }

  updateRecetas_seguidas() {
    (this.guardado) ? this.repice.usuarios.push(this.user) : this.repice.usuarios = this.repice.usuarios.filter(u=>u.id != this.user.id);
    const copia_receta = Object.assign({}, this.repice)
    copia_receta.imagen = null;
    this.repicesService.updateRepice(copia_receta).subscribe({
      next: r => {
        (this.guardado) ? this.user.recetas_seguidas?.push(r) : this.user.recetas_seguidas = this.user.recetas_seguidas?.filter(rec=>rec.id != r.id);
        this.authService.setUser(this.user);
      }
    })
  }
}
