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
  constructor(private repicesService:RepicesService) {}
  ngOnInit(): void {
      this.repicesService.getRepices().subscribe(r=>this.repices=r);
  }
  search = "";
  tipo = "";
  glutenFree = false;
  lactosaFree = false;
  vegan = false;
  level = 0;
  changeLevel(newLevel:number){
    this.level = newLevel
  }
  reset(){
    this.search = "";
    this.tipo = "";
    this.glutenFree = false;
    this.lactosaFree = false;
    this.vegan = false;
    this.level = 0;
  }
  difA=false;
  difD=false;
  fechaA=false;
  fechaD=false;
  orderDificultadA(){
    this.reset();
    this.repices.sort((a, b)=> a.dificultad-b.dificultad);
    this.difA=true;
    this.difD=false;
    this.fechaA=false;
    this.fechaD=false;
  }
  orderDificultadD(){
    this.reset();
    this.repices.sort((a, b)=> b.dificultad-a.dificultad);
    this.difA=false;
    this.difD=true;
    this.fechaA=false;
    this.fechaD=false;
  }
  orderFechaA(){
    this.reset();
    this.repices.sort((a, b) => (a.creacion > b.creacion) ? 1 : -1);
    this.difA=false;
    this.difD=false;
    this.fechaA=true;
    this.fechaD=false;
  }
  orderFechaD(){
    this.reset();
    this.repices.sort((a, b) => (a.creacion < b.creacion) ? 1 : -1);
    this.difA=false;
    this.difD=false;
    this.fechaA=false;
    this.fechaD=true;
  }
  orderDefault(){
    this.reset();
    this.repices.sort((a, b) => a.id-b.id);
    this.difA=false;
    this.difD=false;
    this.fechaA=false;
    this.fechaD=false;
  }
}
