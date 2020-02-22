import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnInit {
  @Input() list;
  @Input() selectedValue;
  @Output() valueChange = new EventEmitter();
  @Input() dropdownMinWidth;
  @Input() dropdownMaxHeight;
  @Input() disabledContent;
  @Input() disabledDropDown;

  private disabledContentValue;
  private disabledContentNumber;
  public closed = true;

  constructor(private userService: UserService) {}

  ngOnInit() {
    if (this.disabledContent) {
      this.disabledContentValue = this.disabledContent.value;
      this.disabledContentNumber = this.disabledContent.number;
    }
  }
  openOrClose() {
    if (!this.disabledDropDown) {
      this.closed = !this.closed;
    }
  }

  selectItem(name, item) {
    this.valueChange.emit(item);
    this.selectedValue = name;
    this.closed = true;
  }
}
