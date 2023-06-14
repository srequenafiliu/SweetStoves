import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IRepice } from '../interfaces/i-repice';
import { IUser } from '../interfaces/i-user';
import { RepicesService } from '../services/repices.service';

@Component({
  selector: 'repice-add',
  templateUrl: './repice-add.component.html',
  styleUrls: ['./repice-add.component.css']
})
export class RepiceAddComponent implements OnInit {
  @Input() user!:IUser;
  newRepice!:IRepice;
  ingredientesString = '';
  elaboracionString = '';

  constructor(private repicesService:RepicesService) {}

  ngOnInit(): void {
    this.initRepice();
  }
  initRepice() {
    this.newRepice = {
      id: 0,
      usuario: {
        id: this.user.id,
        usuario: this.user.usuario,
        correo: this.user.correo,
        imagen: this.user.imagen
      },
      nombre: '',
      tipo: '',
      necesidades: [],
      ingredientes: [],
      elaboracion: [],
      dificultad: 0,
      imagen: '',
      creacion: new Date('')
    };
  }
  saveNeeds(input:HTMLInputElement){
    input.checked ? this.newRepice.necesidades.push(input.value) :
    this.newRepice.necesidades.splice(this.newRepice.necesidades.indexOf(input.value), 1);
  }
  setLevel(level:number){
    this.newRepice.dificultad = level;
  }
  changeImage(fileInput:HTMLInputElement) {
    if (!fileInput.files || fileInput.files.length === 0) {return;}
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);
    reader.addEventListener('loadend', () => this.newRepice.imagen = reader.result as string);
  }
  reset(input1:HTMLInputElement, input2:HTMLInputElement, input3:HTMLInputElement, img:HTMLInputElement){
    this.initRepice();
    this.ingredientesString = '';
    this.elaboracionString = '';
    input1.checked = false;
    input2.checked = false;
    input3.checked = false;
    img.value = '';
  }
  @Output() addNewRepice = new EventEmitter<IRepice>();
  addRepice(receta:IRepice){
    this.newRepice.ingredientes = this.ingredientesString.split('\n');
    this.newRepice.elaboracion = this.elaboracionString.split('\n');
    this.newRepice.creacion = new Date(Date.now());
    this.repicesService.addRepice(receta).subscribe({
      next:()=>this.addNewRepice.emit(receta)
    });
  }
}
