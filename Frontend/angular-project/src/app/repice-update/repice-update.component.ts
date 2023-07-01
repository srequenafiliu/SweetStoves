import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IUser } from '../interfaces/i-user';
import { IRepice } from '../interfaces/i-repice';
import { RepicesService } from '../services/repices.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'repice-update',
  templateUrl: './repice-update.component.html',
  styleUrls: ['./repice-update.component.css']
})
export class RepiceUpdateComponent implements OnInit {
  @Input() user!:IUser;
  recetas!:IRepice[];
  id = 0;
  @Output() updateRepice = new EventEmitter<IRepice>();
  receta!:IRepice;
  errores:string[] = [];
  checklist:{id:string, value:string, checked:boolean}[] = [
    {id:'sinGluten', value:'Sin gluten', checked:false},
    {id:'sinLactosa', value:'Sin lactosa', checked:false},
    {id:'vegana', value:'Vegana', checked:false}
  ];
  textareas:{title:string, name:string, value:string}[] = [
    {title:'Ingredientes', name:'ingredientes', value:''},
    {title:'Elaboración', name:'elaboración', value:''}
  ];
  opcion = 'conservar';

  constructor(private repicesService:RepicesService, private authService:AuthService) {}

  ngOnInit(): void {
    this.recetas = (this.user.recetas) ? this.user.recetas : [];
  }

  getReceta() {
    this.repicesService.getRepice(this.id).subscribe({
      next: resp => {
        this.receta = resp;
        for (const item of this.checklist) item.checked = this.receta.necesidades.includes(item.value);
        this.textareas[0].value = this.receta.ingredientes.join("\n");
        this.textareas[1].value = this.receta.elaboracion.join("\n");
      },
      error: () => this.id = 0
    })
  }

  setLevel = (level:number) => this.receta.dificultad = level;

  getArray = (name:string, valor:string) => (name == 'ingredientes') ?
  this.receta.ingredientes = valor.split('\n') : this.receta.elaboracion = valor.split('\n');

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
    reader.addEventListener('loadend', () => this.receta.imagen = reader.result as string);
  }

  reset(img:HTMLInputElement){
    this.getReceta();
    img.value = '';
  }

  updateReceta(receta:IRepice, img:HTMLInputElement) {
    receta.necesidades = this.checklist.filter(n=>n.checked).map(n=>n.value);
    const copia_receta = Object.assign({}, receta)
    if (this.opcion == "conservar") copia_receta.imagen = null;
    this.repicesService.updateRepice(copia_receta).subscribe({
      next:respu=>{
        this.authService.addAlert("alertUpdate", true, "Receta actualizada correctamente", true);
        this.updateRepice.emit(respu);
        this.reemplazarReceta(this.user.recetas, respu)
        this.reemplazarReceta(this.user.recetas_seguidas, respu)
        this.authService.setUser(this.user);
        this.opcion = 'conservar'
        img.value = '';
      },
      error:e=>this.errores = (e.error.errores != undefined) ? e.error.errores : []
    });
  }
  reemplazarReceta(array:IRepice[]|undefined, receta:IRepice) {
    if (array) for (const i in array) if(array[i].id == receta.id) array.splice(+i, 1, receta);
  }
}
