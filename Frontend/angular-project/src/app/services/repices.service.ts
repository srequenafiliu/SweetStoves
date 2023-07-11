import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { IRepice } from '../interfaces/i-repice';

@Injectable({
  providedIn: 'root'
})
export class RepicesService {
  private repiceURL="recetas";
  constructor(private http:HttpClient) { }

  getRepices(pag:number, size:number, sortField:string, sortDir:string, nombre:string, tipo:string, necesidades:string, dificultad:number):Observable<{count:number, result:IRepice[]}> {
    let params:HttpParams = new HttpParams().set("pag", pag).set("size", size).set("sortField", sortField)
    .set("sortDir", sortDir).set("nombre", nombre).set("tipo", tipo).set("necesidades", necesidades);
    params = (dificultad != 0) ? params.set("dificultad", dificultad) : params;
    return this.http.get<{count:number, result:IRepice[]}>(this.repiceURL, {params}).pipe(
      catchError((resp: HttpErrorResponse) => throwError( () => 'Error '+resp.status+': '+resp.statusText))
    );
  }

  getRepice(idReceta:number):Observable<IRepice> {
    return this.http.get<IRepice>(this.repiceURL+'/'+idReceta).pipe(response=>response);
  }

  addRepice(newRepice:IRepice):Observable<IRepice> {
    return this.http.post<{receta:IRepice, mensaje:string, error?:string}>(this.repiceURL, newRepice)
    .pipe(map(response => response.receta));
  }

  updateRepice(repice:IRepice):Observable<IRepice>{
    return this.http.put<{receta:IRepice, mensaje:string, error?:string}>(this.repiceURL+'/'+repice.id, repice).pipe(
      map(response=>response.receta)
    )
  }

  deleteRepice(idReceta:number):Observable<string> {
    return this.http.delete<{mensaje:string}>(this.repiceURL+"/"+idReceta).pipe(map(response =>response.mensaje));
  }
}
