import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { IRepice } from '../interfaces/i-repice';

@Injectable({
  providedIn: 'root'
})
export class RepicesService {
  private repiceURL="recetas";
  constructor(private http:HttpClient) { }

  getRepices():Observable<IRepice[]> {
    return this.http.get<IRepice[]>(this.repiceURL).pipe(
      catchError((resp: HttpErrorResponse) => throwError( () =>
        `Error obteniendo recetas. Código de servidor: ${resp.status}. Mensaje: ${resp.message}`))
    );
  }

  getRepicesUser(idUsuario:number):Observable<IRepice[]> {
    return this.http.get<IRepice[]>(this.repiceURL).pipe(
      map(response=>response.filter(repice => repice.usuario.id == idUsuario)),
      catchError((resp: HttpErrorResponse) => throwError( () =>
        `Error obteniendo recetas. Código de servidor: ${resp.status}. Mensaje: ${resp.message}`))
    );
  }

  getRepice(idReceta:number):Observable<IRepice> {
    return this.http.get<IRepice>(this.repiceURL+'/'+idReceta).pipe(response=>response);
  }

  addRepice(newRepice:IRepice):Observable<IRepice> {
    return this.http.post<{receta:IRepice, mensaje:string, error?:string}>(this.repiceURL, newRepice)
    .pipe(map(response => response.receta));
  }

  deleteRepice(idReceta:number):Observable<string> {
    return this.http.delete<{mensaje:string}>(this.repiceURL+"/"+idReceta).pipe(map(response =>response.mensaje));
  }
}
