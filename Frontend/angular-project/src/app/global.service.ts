import { Injectable } from '@angular/core';
import { IUser } from './interfaces/i-user';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  id!:number;
  usuario!: string;
  user!: IUser;
  logged = false;
}
