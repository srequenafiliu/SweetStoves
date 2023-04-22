import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/i-user';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { ILogin } from '../interfaces/i-login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authURL="auth";
  constructor(private http:HttpClient, private router:Router) { }

  login(userLogin:ILogin):Observable<{usuario: IUser, accessToken: string}> {
    return this.http.post<{usuario:IUser,accessToken:string}>(this.authURL+'/login', userLogin).pipe(
      catchError((resp: HttpErrorResponse) => throwError( () =>
        `Error al iniciar sesión. Código de servidor: ${resp.status}. Mensaje: ${resp.message}`))
    );
  }

  setUser(usuario:IUser){
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  setData(token:string, usuario:IUser) {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.router.navigate(['/perfil_usuario']);
  }

  getToken(){
    return localStorage.getItem('token');
  }

  getUser(){
    const usuarioStr = localStorage.getItem('usuario');
    return (usuarioStr != null) ? JSON.parse(usuarioStr) : null;
  }

  isLoggedIn(){
    const tokenStr = localStorage.getItem('token');
    return !(tokenStr == undefined || tokenStr == '' || tokenStr == null)
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
