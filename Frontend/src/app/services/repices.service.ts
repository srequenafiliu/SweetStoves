import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRepice } from '../interfaces/i-repice';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RepicesService {
  private repiceURL="recetas";
  constructor(private http:HttpClient) { }

  getRepices(pag:number, size:number, sortField:string, sortDir:string, nombre:string, tipo:string, necesidades:string, dificultad:number, id_usuario:number):Observable<{count:number, result:IRepice[]}> {
    let params:HttpParams = new HttpParams().set("pag", pag).set("size", size).set("sortField", sortField)
    .set("sortDir", sortDir).set("nombre", nombre).set("tipo", tipo).set("necesidades", necesidades);
    params = (dificultad != 0) ? params.set("dificultad", dificultad) : params;
    params = (id_usuario != 0) ? params.set("id_usuario", id_usuario) : params;
    return this.http.get<{count:number, result:IRepice[]}>(this.repiceURL, {params}).pipe(
      catchError((resp: HttpErrorResponse) => throwError( () => 'Error '+resp.status+': '+resp.statusText))
    );
  }

  getRepice = (idReceta:number):Observable<IRepice> => this.http.get<IRepice>(this.repiceURL+'/'+idReceta).pipe(response=>response);

  addRepice = (newRepice:IRepice):Observable<IRepice> => this.http.post<{receta:IRepice, mensaje:string, error?:string}>(this.repiceURL, newRepice).pipe(map(response => response.receta));

  updateRepice = (repice:IRepice):Observable<IRepice> => this.http.put<{receta:IRepice, mensaje:string, error?:string}>(this.repiceURL+'/'+repice.id, repice).pipe(map(response=>response.receta))

  deleteRepice = (idReceta:number):Observable<string> => this.http.delete<{mensaje:string}>(this.repiceURL+"/"+idReceta).pipe(map(response =>response.mensaje));
}
