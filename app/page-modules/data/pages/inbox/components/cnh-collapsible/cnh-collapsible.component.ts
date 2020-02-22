import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter
} from '@angular/core';
// import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'cnh-collapsible',
  templateUrl: './cnh-collapsible.component.html',
  styleUrls: ['./cnh-collapsible.component.css']
})
export class CnhCollapsibleComponent implements OnInit, OnChanges {
  @Input() public sideToggle: boolean;
  @Input() public startOpen: boolean;
  @Input() public centerHeaderContent: boolean;
  @Input() public linedHeaderStyle: boolean;
  @Input() public type: string; // fleet: centered content
  @Output() public isOpen: EventEmitter<boolean> = new EventEmitter();
  @Input() showHeaderLine: boolean;

  public open: boolean;
  public state: string;

  constructor() {
    /* placeholder method */
    this.sideToggle = false;
    this.startOpen = false;
    this.centerHeaderContent = false;
    this.linedHeaderStyle = false;
    this.type = '';
    this.open = false;
    this.state = 'closed';
  }

  public ngOnInit() {
    /* placeholder method */
  }

  public ngOnChanges(changes: any) {
    if (changes.startOpen) {
      this.open = this.startOpen;
      this.state = this.open ? 'open' : 'closed';
    }
  }

  public toggle() {
    this.open = !this.open;
    this.state = this.open ? 'open' : 'closed';
    this.isOpen.emit(this.open);
  }
}
