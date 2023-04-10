import { Pipe, PipeTransform } from '@angular/core';
import { IRepice } from '../interfaces/i-repice';

@Pipe({
  name: 'needsFilter'
})
export class NeedsFilterPipe implements PipeTransform {

  transform(repices: IRepice[], filterBy: boolean, value:string): IRepice[] {
    return filterBy ? repices.filter(repice => repice.necesidades.includes(value)) : repices;
  }

}
