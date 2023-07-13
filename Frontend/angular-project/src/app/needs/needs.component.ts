import { Component } from '@angular/core';

@Component({
  selector: 'needs',
  templateUrl: './needs.component.html',
  styleUrls: ['./needs.component.css']
})
export class NeedsComponent {
  needs:{fragment:string, titulo:string}[] = [
    {fragment:'gluten', titulo:'celiac@s'},
    {fragment:'lactosa', titulo:'intolerantes a la lactosa'},
    {fragment:'vegano', titulo:'vegan@s'}
  ];
}
