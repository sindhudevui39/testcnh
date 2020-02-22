import { Component, Input, Output, EventEmitter } from '@angular/core';

import { UserService } from '@services/user/user.service';
import { FilterModel } from '@fleet/services/fleet-filter/fleet-filter.service';

import { BrandNames } from '@enums/brand.enum';

@Component({
  selector: 'app-filter-dropdown',
  templateUrl: './filter-dropdown.component.html',
  styleUrls: ['./filter-dropdown.component.css']
})
export class FilterDropdownComponent {
  private _dropdownList: Array<any>;
  @Input() dropdownId: string;
  @Input()
  dropdownName: string;
  @Output()
  selectedOptions = new EventEmitter<Array<any>>();
  public closed = true;
  public selectCount = '';

  @Input() set dropdownList(value: Array<any>) {
    this._dropdownList = [];
    if (value) {
      this._dropdownList = value.map(m => m);

      this.selectCount = this.getSelectCount();
    }
  }
  brands = BrandNames;

  constructor(public userService: UserService) {}

  get dropdownList(): Array<any> {
    return this._dropdownList;
  }

  checkboxClicked(item: FilterModel, event) {
    if (this.dropdownId === 'DAYS') {
      this.closed = true;

      const _item = this._dropdownList.filter(obj => obj.name === item.name)[0];
      if (_item.checked) {
        if (_item.id === 'Last 7 Days') {
          event.preventDefault();
          return;
        }
        this.selectedOptions.emit(['alreadychecked']);
      } else {
        this.updateOnlyCheckedItem(item);
        this.selectCount = this.getSelectCount();
        this.selectedOptions.emit([item.name]);
      }
    } else {
      if (item.name === 'Select All') {
        if (!item.checked) {
          this.checkAllOptions();
        } else {
          this.uncheckAllOptions();
        }
      } else {
        this.updateCheckedItem(item);
      }
      this.selectedOptions.emit(
        this._dropdownList
          .filter((f, index) => {
            if (index === 0) {
              return false;
            }

            if (f.checked) {
              return true;
            } else {
              return false;
            }
          })
          .map(m => m.name)
      );

      this.selectCount = this.getSelectCount();

      if (this.isAllChecked()) {
        this._dropdownList[0].checked = true;
      } else {
        this._dropdownList[0].checked = false;
      }
    }
  }

  private updateCheckedItem(value): void {
    this._dropdownList.forEach(obj => {
      if (value.name === obj.name) {
        obj.checked = !obj.checked;
      }
    });
  }

  private getSelectCount(): string {
    let checkedBoxesLength = 0;
    const index = this.dropdownId !== 'DAYS' ? 1 : 0;
    for (let i = index; i < this._dropdownList.length; i++) {
      const el = this._dropdownList[i];

      if (el.checked) {
        checkedBoxesLength = checkedBoxesLength + 1;
      }
    }

    if (checkedBoxesLength === 0) {
      return '';
    } else {
      return (this.selectCount = ' (' + checkedBoxesLength.toString() + ')');
    }
  }

  private checkAllOptions(): void {
    this._dropdownList.forEach(obj => (obj.checked = true));
  }

  private uncheckAllOptions(): void {
    this._dropdownList.forEach(obj => (obj.checked = false));
  }

  private isAllChecked(): boolean {
    const expectedCheckCount = this._dropdownList.length - 1;
    let actualCheckCount = 0;

    for (let i = 1; i < this._dropdownList.length; i++) {
      const element = this._dropdownList[i];

      if (element.checked) {
        actualCheckCount++;
      }
    }

    return expectedCheckCount === actualCheckCount;
  }

  private updateOnlyCheckedItem(item) {
    this._dropdownList.forEach(obj => {
      if (item.name === obj.name) {
        obj.checked = !obj.checked;
      } else {
        obj.checked = false;
      }
    });
  }
}
