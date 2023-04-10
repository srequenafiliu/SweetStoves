import { Pipe, PipeTransform } from '@angular/core';
import { IRepice } from '../interfaces/i-repice';

@Pipe({
  name: 'typeFilter'
})
export class TypeFilterPipe implements PipeTransform {

  transform(repices: IRepice[], filterBy: string): IRepice[] {
    return filterBy ? repices.filter(repice => repice.tipo.toLocaleLowerCase() == filterBy) : repices;
  }

}
