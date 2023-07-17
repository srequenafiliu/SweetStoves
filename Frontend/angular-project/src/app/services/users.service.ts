import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { IUser } from '../interfaces/i-user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private userURL="usuarios";
  constructor(private http:HttpClient) { }

  getUsers(pag:number, size:number):Observable<{count:number, result:IUser[]}> {
    const params:HttpParams = new HttpParams().set("pag", pag).set("size", size);
    return this.http.get<{count:number, result:IUser[]}>(this.userURL, {params}).pipe(
      catchError((resp: HttpErrorResponse) => throwError( () => 'Error '+resp.status+': '+resp.statusText))
    );
  }

  getUser = (idUsuario:number):Observable<IUser> => this.http.get<IUser>(this.userURL+'/'+idUsuario);

  updateUser = (user:IUser):Observable<IUser> => this.http.put<{usuario:IUser, mensaje:string, error?:string}>(this.userURL+'/'+user.id, user).pipe(map(response=>response.usuario))

  deleteUser = (idUsuario:number):Observable<string> => this.http.delete<{mensaje:string}>(this.userURL+"/"+idUsuario).pipe(map(response =>response.mensaje));

}
