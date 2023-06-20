import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser, IUserPass } from '../interfaces/i-user';
import { Observable, map } from 'rxjs';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
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

  setUser(usuario:IUser){
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  setData(token:string, usuario:IUser) {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.router.navigate(['/perfil_usuario']);
  }

  getToken = () => localStorage.getItem('token');

  getUser(){
    const usuarioStr = localStorage.getItem('usuario');
    return (usuarioStr != null) ? JSON.parse(usuarioStr) : null;
  }
  checkToken(token:string|null) {
    if (token) {
      const tokenDecoded:{exp:number} = jwtDecode(token);
      const expDate = tokenDecoded.exp;
      if (new Date(expDate*1000) < new Date()) this.logout();
    }
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    return true;
  }
}
