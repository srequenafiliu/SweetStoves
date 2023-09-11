import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { IUser, IUserDto } from '../interfaces/i-user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private userURL="usuarios";
  constructor(private http:HttpClient) { }

  getUsers(pag:number, size:number):Observable<{count:number, result:IUserDto[]}> {
    const params:HttpParams = new HttpParams().set("pag", pag).set("size", size);
    return this.http.get<{count:number, result:IUserDto[]}>(this.userURL, {params}).pipe(
      catchError((resp: HttpErrorResponse) => throwError( () => 'Error '+resp.status+': '+resp.statusText))
    );
  }

  getUser = ():Observable<IUser> => this.http.get<IUser>(`${this.userURL}/logged`);

  updateUser = (user:IUser):Observable<IUser> => this.http.put<{usuario:IUser, mensaje:string, error?:string}>(`${this.userURL}/logged`, user).pipe(map(response=>response.usuario))

  deleteUser = ():Observable<string> => this.http.delete<{mensaje:string}>(`${this.userURL}/logged`).pipe(map(response =>response.mensaje));
}
