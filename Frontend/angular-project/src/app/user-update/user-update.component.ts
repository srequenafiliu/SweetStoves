import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IUser } from '../interfaces/i-user';
import { UsersService } from '../services/users.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent implements OnInit {
  @Input() user!:IUser;
  userUpdate!:IUser;
  users:IUser[] = [];
  opcion = 'conservar';
  errores:string[] = [];
  usuarioExistente = false;
  correoExistente = false;
  password = '';
  passwordIncorrecto = false;

  constructor(private usersService:UsersService, private authService:AuthService) {}
  ngOnInit(): void {
    this.initUser(this.user);
    this.usersService.getUsers().subscribe(u=>this.users=u);
  }

  initUser(usuario:IUser) {
    this.userUpdate = {
      id: usuario.id,
      usuario: usuario.usuario,
      correo: usuario.correo,
      password: usuario.password,
      imagen: null,
      datosUsuario: {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        nombre: usuario.datosUsuario!.nombre,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        apellido: usuario.datosUsuario!.apellido,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        telefono: usuario.datosUsuario!.telefono
      },
      recetas: [],
      recetas_seguidas: usuario.recetas_seguidas
    };
  }

  changeImage(fileInput:HTMLInputElement) {
    if (!fileInput.files || fileInput.files.length === 0) this.userUpdate.imagen = null;
    else {
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(fileInput.files[0]);
      reader.addEventListener('loadend', () => this.userUpdate.imagen = reader.result as string);
    }
  }

  @Output() modificarUsuario = new EventEmitter<IUser>();

  updateUser(newUser:IUser, fileImage:HTMLInputElement) {
    const valor = fileImage.value;
    if (this.opcion == 'borrar') newUser.imagen = this.opcion;
    if (newUser.datosUsuario?.apellido == "") newUser.datosUsuario.apellido = null;
    if (newUser.datosUsuario?.telefono == "") newUser.datosUsuario.telefono = null;
    newUser.password = this.password;
    this.usersService.updateUser(newUser).subscribe({
      next:respu=>{
        newUser.imagen = (valor != '') ? newUser.imagen : this.user.imagen;
        this.user = newUser;
        this.modificarUsuario.emit((valor == '' && this.opcion != 'borrar') ? newUser : respu);
        this.authService.setUser((valor == '' && this.opcion != 'borrar') ? newUser : respu);
        this.reset(newUser, fileImage);
        this.addAlert();
        console.log(respu)
      },
      error:e=>{
        this.errores = (e.error.errores != undefined) ? e.error.errores : [];
        this.usuarioExistente = (e.error.error != undefined) ? e.error.error.includes("usuario_unique") : false;
        this.correoExistente = (e.error.error != undefined) ? e.error.error.includes("correo_unique") : false;
        this.passwordIncorrecto = (e.error.error != undefined) ? e.error.error.includes("Contraseña") : false;
        this.password = '';
        console.log(e)
      }
    });
  }

  buscarErrores(name:string):number {
    for (const i in this.errores) {
      if (this.errores[i].includes("datosUsuario.")) this.errores[i] = this.errores[i].replace("datosUsuario.", "");
      if (this.errores[i].includes("telefono")) this.errores[i] = this.errores[i].replace("telefono", "teléfono");
      if (this.errores[i].includes(name)) return +i;
    }
    return -1;
  }

  reset(newUser:IUser, fileImage:HTMLInputElement){
    this.initUser(newUser);
    this.errores = [];
    this.usuarioExistente = false;
    this.correoExistente = false;
    this.passwordIncorrecto = false;
    this.password = '';
    fileImage.value = '';
  }

  addAlert(){
    const div = document.getElementsByTagName("form")[1].lastElementChild;
    const alert = document.createElement("div");
    alert.className = "alert alert-dismissible alert-primary offset-md-5 col-md-7 fade show";
    const icon = document.createElement("i");
    icon.className = "fa-solid fa-circle-check";
    const close = document.createElement("button");
    close.className = "btn-close";
    close.setAttribute("type", "button");
    close.setAttribute("data-bs-dismiss", "alert");
    alert.appendChild(icon);
    alert.appendChild(close);
    alert.appendChild(document.createTextNode(" Datos actualizados correctamente"));
    div?.insertBefore(alert, div.lastChild);
  }
}
