import { IRepice } from "./i-repice";

export interface IUser {
  id:number;
  usuario:string;
  correo:string;
  password?:string;
  imagen:string|null;
  datosUsuario?:IUserinfo;
  recetas?:IRepice[];
  recetas_seguidas?:IRepice[];
}

export interface IUserinfo {
  nombre:string;
  apellido:string|null;
  telefono:string|null;
}

export interface IUserDto {
  id:number;
  usuario:string;
  imagen:string|null;
  nombre:string;
  recetas:string[];
}

export interface IPasswordDto {
  password:string;
  new_password:string;
}
