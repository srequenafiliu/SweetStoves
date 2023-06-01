import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { IUser } from '../interfaces/i-user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private userURL="usuarios";
  constructor(private http:HttpClient) { }

  getUsers():Observable<IUser[]> {
    return this.http.get<IUser[]>(this.userURL).pipe(
      catchError((resp: HttpErrorResponse) => throwError( () =>
        `Error obteniendo usuarios. Código de servidor: ${resp.status}. Mensaje: ${resp.message}`))
    );
  }

  getUser(idUsuario:number):Observable<IUser> {
    return this.http.get<IUser>(this.userURL+'/'+idUsuario);
  }

  updateUser(user:IUser):Observable<IUser>{
    return this.http.put<{usuario:IUser, mensaje:string, error?:string}>(this.userURL+'/'+user.id, user).pipe(
      map(response=>response.usuario)
    )
  }
  deleteUser(idUsuario:number):Observable<string> {
    return this.http.delete<{mensaje:string}>(this.userURL+"/"+idUsuario).pipe(map(response =>response.mensaje));
  }
}
