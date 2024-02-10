import { Component, OnInit } from '@angular/core';
import { IRepice } from '../interfaces/i-repice';
import { IUser } from '../interfaces/i-user';
import { Location } from '@angular/common';
import { RepicesService } from '../services/repices.service';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import jwtDecode from 'jwt-decode';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'repice-detail',
  templateUrl: './repice-detail.component.html',
  styleUrls: ['./repice-detail.component.css']
})
export class RepiceDetailComponent implements OnInit {
  id_receta:number = +this.route.snapshot.params['id'];
  repice!:IRepice;
  necesidades:string[] = [];
  token = this.authService.getToken();
  user!:IUser;
  receta_creada?:boolean;
  guardado?:boolean;

  constructor(protected location: Location, protected repicesService: RepicesService, private usersService:UsersService,
    private authService:AuthService, private route: ActivatedRoute, private titleService: Title) {}

  ngOnInit() {
    if (this.token) this.usersService.getUser().subscribe(u => this.user = u);
    this.repicesService.getRepice(this.id_receta).subscribe({
      next:p => {
        this.repice = p;
        for (let n of p.needs) {
          if (n == "g") this.necesidades.push("Sin gluten")
          if (n == "l") this.necesidades.push("Sin lactosa")
          if (n == "v") this.necesidades.push("Vegana")
        }
        this.titleService.setTitle(this.titleService.getTitle()+" "+p.nombre)
        if (this.token) {
          this.receta_creada = p.usuario.id == jwtDecode<{id:number}>(this.token).id
          this.guardado = p.usuarios.map(u => u.id).includes(jwtDecode<{id:number}>(this.token).id)
        }
      }
    });
  }

  guardarReceta() {
    this.repicesService.followRepice(this.id_receta).subscribe({
      next:m => this.authService.addAlert("alertSave", true, <string>m, false)
    });
  }
}
