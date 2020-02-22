import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  @Input() public placeholder: string;
  @Input() public value: string;
  @Input() public backgroundColor: string;
  @Output() public valueChange = new EventEmitter<string>();
  @Output() public onblurAndFocus = new EventEmitter<string>();
  @Output() public changeEvent = new EventEmitter<any>();
  searchIconColor: boolean;
  constructor() {}

  ngOnInit() {
    this.searchIconColor = true;
  }
  onSearch(value, event?) {
    if (event) {
      const data = {
        searchString: value,
        event
      };
      this.changeEvent.emit(data);
    }
    this.valueChange.emit(value);
  }
}
