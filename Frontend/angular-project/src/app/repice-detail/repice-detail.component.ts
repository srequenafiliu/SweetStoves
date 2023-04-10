import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IRepice } from '../interfaces/i-repice';
import { RepicesService } from '../services/repices.service';

@Component({
  selector: 'repice-detail',
  templateUrl: './repice-detail.component.html',
  styleUrls: ['./repice-detail.component.css']
})
export class RepiceDetailComponent implements OnInit {
  repice!: IRepice;
  constructor(
    private route: ActivatedRoute,
    private repicesService: RepicesService,
    private routeDirecto: Router
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.params['id'];
    // Recibimos parámetro
    this.repicesService.getRepice(id).subscribe({
      next:(p) => (this.repice = p),
      error:(error) => console.error(error)
    }
    );
  }

  numeroPaso(paso:string){
    return this.repice.elaboracion.indexOf(paso)+1;
  }

  primerPaso(paso:string){
    return this.repice.elaboracion.indexOf(paso)+1 == 1;
  }

  goBack(){
    this.routeDirecto.navigate(['/recetas']);
  }
}
