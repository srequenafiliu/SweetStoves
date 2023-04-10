import { Pipe, PipeTransform } from '@angular/core';
import { IRepice } from '../interfaces/i-repice';

@Pipe({
  name: 'repiceFilter'
})
export class RepiceFilterPipe implements PipeTransform {

  transform(repices: IRepice[], filterBy: string): IRepice[] {
    const filter = filterBy ? filterBy.toLocaleLowerCase() : null;
    return filter ? repices.filter(repice => repice.nombre.toLocaleLowerCase().includes(filter)) : repices;
  }

}
