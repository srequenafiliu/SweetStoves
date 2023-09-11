import { IUser } from "./i-user";

export interface IRepice {
  id:number;
  usuario:IUser;
  nombre:string;
  tipo:string;
  needs:string;
  ingredientes:string[];
  elaboracion:string[];
  dificultad:number;
  imagen:string|null;
  creacion:Date;
  usuarios:IUser[];
}

export interface IRepiceDto {
  id:number;
  usuario:string;
  nombre:string;
  tipo:string;
  necesidades:string[];
  dificultad:number;
  imagen:string;
  creacion:Date;
}
