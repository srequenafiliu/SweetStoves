import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IRepice } from '../interfaces/i-repice';
import { RepicesService } from '../services/repices.service';

@Component({
  selector: 'repice-item',
  templateUrl: './repice-item.component.html',
  styleUrls: ['./repice-item.component.css']
})
export class RepiceItemComponent {
  @Input() repice!:IRepice;
  constructor(private repicesService:RepicesService,private router : Router) {}
  cuentaUsuario():boolean{
    return this.router.url === '/recetas';
  }
  @Output() deleteRepice = new EventEmitter<IRepice>();
  borrarReceta(){
    this.repicesService.deleteRepice(this.repice.id).subscribe({
      next:respu=>{this.deleteRepice.emit(this.repice);console.log(respu)},
      error:e=>console.log(e)
    })
  }
}
