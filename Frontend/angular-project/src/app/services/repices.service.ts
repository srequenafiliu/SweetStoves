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
