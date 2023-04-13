import { IRepice } from "./i-repice";
import { IUserinfo } from "./i-userinfo";

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
