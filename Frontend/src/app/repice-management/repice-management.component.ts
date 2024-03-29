import { Component, OnInit } from '@angular/core';
import { IRepice } from '../interfaces/i-repice';
import { RepicesService } from '../services/repices.service';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { IUser } from '../interfaces/i-user';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'repice-management',
  templateUrl: './repice-management.component.html',
  styleUrls: ['./repice-management.component.css']
})
export class RepiceManagementComponent implements OnInit {
  url = window.location.pathname;
  titulo = this.url.includes('nueva-receta') ? 'Nueva receta' : 'Actualiza tus recetas';
  user!:IUser;
  id_receta!:number;
  receta!:IRepice;
  opcion = 'conservar';
  checklist:{id:string, titulo:string, value:string, checked:boolean}[] = [
    {id:'sinGluten', titulo:'Sin gluten', value:'g', checked:false},
    {id:'sinLactosa', titulo:'Sin lactosa', value:'l', checked:false},
    {id:'vegana', titulo:'Vegana', value:'v', checked:false}
  ];
  textareas:{title:string, name:string, ej:string, value:string}[] = [
    {title:'Ingredientes', name:'ingredientes', ej:'Ingrediente nº1\nIngrediente nº2\n...', value:''},
    {title:'Elaboración', name:'elaboración', ej:'Paso nº1\nPaso nº2\n...', value:''}
  ];
  errores:string[] = [];

  constructor(private usersService:UsersService, private repicesService:RepicesService,
    private authService:AuthService, private route:ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id_receta = (+params["id"]) ? +params["id"] : 0
      if (this.id_receta != 0) this.getReceta()
    });
    this.usersService.getUser().subscribe(u => {
      this.user = u;
      if (this.url.includes('nueva-receta')) this.receta = this.initRepice();
    });
  }

  initRepice():IRepice {
    return {
      id: 0,
      usuario: {
        id: this.user.id,
        usuario: this.user.usuario,
        correo: this.user.correo,
        imagen: this.user.imagen
      },
      nombre: '',
      tipo: '',
      needs: '',
      ingredientes: [],
      elaboracion: [],
      dificultad: 0,
      imagen: '',
      creacion: new Date(''),
      usuarios: []
    };
  }

  getReceta() {
    this.repicesService.getRepice(this.id_receta).subscribe({
      next: resp => {
        this.receta = resp;
        for (const item of this.checklist) item.checked = this.receta.needs.includes(item.value);
        this.textareas[0].value = this.receta.ingredientes.join("\n");
        this.textareas[1].value = this.receta.elaboracion.join("\n");
      },
      error: () => this.id_receta = 0
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
    if (this.url.includes('nueva-receta')) {
      this.receta = this.initRepice();
      for (const item of this.checklist) item.checked = false;
      for (const item of this.textareas) item.value = '';
    }
    else this.getReceta();
    img.value = '';
  }

  repiceManagement(receta:IRepice, img:HTMLInputElement) {
    receta.needs = this.checklist.filter(n=>n.checked).map(n=>n.value).join("");
    this.url.includes('nueva-receta') ? this.addRepice(receta, img) : this.updateReceta(receta, img);
  }

  addRepice(receta:IRepice, img:HTMLInputElement) {
    receta.creacion = new Date(Date.now());
    this.repicesService.addRepice(receta).subscribe({
      next:()=>{
        this.authService.addAlert("alertRepice", true, "Receta creada correctamente", true);
        this.reset(img)
      },
      error:e=>this.errores = (e.error.errores != undefined) ? e.error.errores : []
    });
  }

  updateReceta(receta:IRepice, img:HTMLInputElement) {
    const copia_receta = Object.assign({}, receta)
    if (this.opcion == "conservar") copia_receta.imagen = null;
    this.repicesService.updateRepice(copia_receta).subscribe({
      next:()=>{
        this.authService.addAlert("alertRepice", true, "Receta actualizada correctamente", true);
        this.opcion = 'conservar'
        img.value = '';
      },
      error:e=>this.errores = (e.error.errores != undefined) ? e.error.errores : []
    });
  }
}
