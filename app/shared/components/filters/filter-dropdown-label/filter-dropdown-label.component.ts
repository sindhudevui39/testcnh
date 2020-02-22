import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filter-dropdown-label',
  templateUrl: './filter-dropdown-label.component.html',
  styleUrls: ['./filter-dropdown-label.component.css']
})
export class FilterDropdownLabelComponent implements OnInit {
  @Input()
  dropdownName: string;
  @Input()
  closed: boolean;
  @Input()
  selectCount: string;

  // Referred in template
  @Output()
  public clicked = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit() {}
}
