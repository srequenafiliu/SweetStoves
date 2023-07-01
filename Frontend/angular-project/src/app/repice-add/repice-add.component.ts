import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IRepice } from '../interfaces/i-repice';
import { IUser } from '../interfaces/i-user';
import { RepicesService } from '../services/repices.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'repice-add',
  templateUrl: './repice-add.component.html',
  styleUrls: ['./repice-add.component.css']
})
export class RepiceAddComponent implements OnInit {
  @Input() user!:IUser;
  @Output() addNewRepice = new EventEmitter<IRepice>();
  newRepice!:IRepice;
  checklist:{id:string, value:string, checked:boolean}[] = [
    {id:'sinGluten', value:'Sin gluten', checked:false},
    {id:'sinLactosa', value:'Sin lactosa', checked:false},
    {id:'vegana', value:'Vegana', checked:false}
  ];
  textareas:{title:string, name:string, ej:string, value:string}[] = [
    {title:'Ingredientes', name:'ingredientes', ej:'Ingrediente nº1\nIngrediente nº2\n...', value:''},
    {title:'Elaboración', name:'elaboración', ej:'Paso nº1\nPaso nº2\n...', value:''}
  ];
  errores:string[] = [];

  constructor(private repicesService:RepicesService, private authService:AuthService) {}

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
      creacion: new Date(''),
      usuarios: []
    };
  }

  setLevel = (level:number) => this.newRepice.dificultad = level;

  getArray = (name:string, valor:string) => (name == 'ingredientes') ?
  this.newRepice.ingredientes = valor.split('\n') : this.newRepice.elaboracion = valor.split('\n');

  buscarErrores(name:string):number {
    for (const i in this.errores) {
      if (this.errores[i].includes("elaboracion")) this.errores[i] = this.errores[i].replace("elaboracion", "elaboración");
      if (this.errores[i].includes(name)) return +i;
    }
    return -1;
  }

  changeImage(fileInput:HTMLInputElement) {
    if (!fileInput.files || fileInput.files.length === 0) {return;}
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);
    reader.addEventListener('loadend', () => this.newRepice.imagen = reader.result as string);
  }

  reset(img:HTMLInputElement){
    this.initRepice();
    for (const item of this.checklist) item.checked = false;
    for (const item of this.textareas) item.value = '';
    img.value = '';
  }

  addRepice(receta:IRepice, img:HTMLInputElement) {
    receta.necesidades = this.checklist.filter(n=>n.checked).map(n=>n.value);
    receta.creacion = new Date(Date.now());
    this.repicesService.addRepice(receta).subscribe({
      next:respu=>{
        this.authService.addAlert("alertAdd", true, "Receta creada correctamente", true);
        this.addNewRepice.emit(respu);
        this.user.recetas?.push(respu);
        this.user.recetas_seguidas?.push(respu);
        this.authService.setUser(this.user);
        this.reset(img)
      },
      error:e=>this.errores = (e.error.errores != undefined) ? e.error.errores : []
    });
  }
}
