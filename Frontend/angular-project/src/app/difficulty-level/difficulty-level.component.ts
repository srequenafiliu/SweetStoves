import { Component,Input } from '@angular/core';

@Component({
  selector: 'difficulty-level',
  templateUrl: './difficulty-level.component.html',
  styleUrls: ['./difficulty-level.component.css']
})
export class DifficultyLevelComponent {
  @Input() level!:number;
}
