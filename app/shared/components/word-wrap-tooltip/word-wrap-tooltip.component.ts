import { Component, Input } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-word-wrap-tooltip',
  templateUrl: './word-wrap-tooltip.component.html',
  styleUrls: ['./word-wrap-tooltip.component.css'],
  animations: [
    trigger('tooltip', [
      transition(':enter', [style({ opacity: 0 }), animate(300, style({ opacity: 1 }))]),
      transition(':leave', [animate(300, style({ opacity: 0 }))])
    ])
  ]
})
export class WordWrapTooltipComponent {
  @Input() text = '';
}
