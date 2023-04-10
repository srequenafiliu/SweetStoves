import { Pipe, PipeTransform } from '@angular/core';
import { IRepice } from '../interfaces/i-repice';

@Pipe({
  name: 'levelFilter'
})
export class LevelFilterPipe implements PipeTransform {

  transform(repices: IRepice[], filterBy: number): IRepice[] {
    return filterBy ? repices.filter(repice => repice.dificultad == filterBy) : repices;
  }

}
