import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, map } from 'rxjs';
import { IUser, IUserPass } from '../interfaces/i-user';
import { ILogin } from '../interfaces/i-login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authURL="auth";
  constructor(private http:HttpClient, private router:Router) { }

  login = (userLogin:ILogin):Observable<string> => this.http
  .post<{accessToken:string, error?:string}>(this.authURL+'/login', userLogin).pipe(map(response=>response.accessToken));

  changePassword = (userPass:IUserPass):Observable<string> => this.http
  .put<{password:string,mensaje:string, error:string}>(this.authURL+'/change_password', userPass).pipe(map(response=>response.password));

  addUser = (newUser:IUser):Observable<IUser> => this.http
  .post<{usuario:IUser, mensaje:string, error?:string}>(this.authURL+'/registro', newUser).pipe(map(response => response.usuario));

  private subject = new Subject<IUser|null>(); // Pseudo EventEmitter
  sendData = (usuario:IUser|null) => this.subject.next(usuario);
  getData = (): Observable<IUser|null> => this.subject.asObservable();

  getUser(){
    const usuarioStr = localStorage.getItem('usuario');
    return (usuarioStr != null) ? JSON.parse(usuarioStr) : null;
  }
  setUser = (usuario:IUser) => localStorage.setItem('usuario', JSON.stringify(usuario));

  getToken = () => localStorage.getItem('token');
  /*expiredToken = (token:string|null) => token && new Date(jwtDecode<{exp:number}>(token).exp*1000) < new Date()
  Si el token tuviese fecha de caducidad, se usaría esta función y, si devolviera true, se debería llamar a logout()*/

  setData(token:string, usuario:IUser) {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.sendData(usuario);
    this.router.navigate(['/perfil-usuario']);
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.sendData(null)
    this.router.navigate(['/inicio'])
  }

  addAlert(id:string, correcto:boolean, texto:string, first:boolean){
    const div = document.getElementById(id);
    const alert = document.createElement("div");
    alert.className = "alert alert-dismissible "+(correcto?"alert-primary":"alert-info")+" fade show"; // Retocar el tamaño cuando se arreglen las otras partes offset-md-1 col-md-10
    const icon = document.createElement("i");
    icon.className = "fa-solid fa-circle-"+((correcto)?"check":"xmark");
    const close = document.createElement("button");
    close.className = "btn-close";
    close.setAttribute("type", "button");
    close.setAttribute("data-bs-dismiss", "alert");
    alert.appendChild(icon);
    alert.appendChild(close);
    alert.appendChild(document.createTextNode(" "+texto));
    div?.insertBefore(alert, (first) ? div.firstChild : div.lastChild);
  }
}
