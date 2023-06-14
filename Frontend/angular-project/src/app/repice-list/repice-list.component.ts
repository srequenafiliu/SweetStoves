import { Component, OnInit } from '@angular/core';
import { IRepice } from '../interfaces/i-repice';
import { RepicesService } from '../services/repices.service';

@Component({
  selector: 'repice-list',
  templateUrl: './repice-list.component.html',
  styleUrls: ['./repice-list.component.css']
})
export class RepiceListComponent implements OnInit{
  title = 'Lista de recetas'
  headers = {nombre: 'Nombre de la receta', tipo: 'Datos de la receta', dificultad: 'Dificultad', creadoEn: 'Fecha de creación'};
  repices:IRepice[] = [];
  search = "";
  tipo = "";
  glutenFree = false;
  lactosaFree = false;
  vegan = false;
  level = 0;
  orden = "";

  constructor(private repicesService:RepicesService) {}
  ngOnInit(): void {
      this.repicesService.getRepices().subscribe(r=>this.repices=r);
  }

  reset(){
    this.search = "";
    this.tipo = "";
    this.glutenFree = false;
    this.lactosaFree = false;
    this.vegan = false;
    this.level = 0;
  }

  ordenar(orden:string){
    this.orden = orden;
    this.reset();
    switch(this.orden) {
      case "difA": this.repices.sort((a, b)=> a.dificultad-b.dificultad); break;
      case "difD": this.repices.sort((a, b)=> b.dificultad-a.dificultad); break;
      case "fechaA": this.repices.sort((a, b) => (a.creacion > b.creacion) ? 1 : -1); break;
      case "fechaD": this.repices.sort((a, b) => (a.creacion < b.creacion) ? 1 : -1); break;
    }
  }
}
