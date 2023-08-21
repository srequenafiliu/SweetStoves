import { IUser } from "./i-user";

export interface IRepice {
  id:number;
  usuario:IUser;
  nombre:string;
  tipo:string; // dulce o salado
  necesidades:string[]; // Es para poner varias especificaciones (vegano, sin gluten...)
  ingredientes:string[];
  elaboracion:string[];
  dificultad:number;
  imagen:string|null;
  creacion:Date;
  usuarios:IUser[];
}
