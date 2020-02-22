import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator
} from '@angular/forms';
import * as _ from 'underscore';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
export interface IAdvancedSelectOption {
  label: string;
  value: any;
  disabled?: boolean;
}

// FIXME: If ngModel il selected before options, it doesn't select the option
@Component({
  selector: 'cnh-advanced-select',
  templateUrl: './cnh-advanced-select.component.html',
  styleUrls: ['./cnh-advanced-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CnhAdvancedSelectComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CnhAdvancedSelectComponent),
      multi: true
    }
  ]
})
export class CnhAdvancedSelectComponent
  implements
    OnChanges,
    OnDestroy,
    AfterViewInit,
    ControlValueAccessor,
    Validator {
  @Input()
  public allOption: string = null;
  @Input()
  public disabled = false;
  @Input()
  public emptyString = '';
  @Input()
  public errorMessage: string = null;
  @Input()
  public height = 'normal';
  @Input()
  public label = '';
  @Input()
  public noOptionsPlaceholder = '';
  @Input()
  public options: IAdvancedSelectOption[];
  @Input()
  public placeholder = '';
  @Input()
  public searchbar = true;
  @Input()
  public searchIcon = true;
  @Input()
  public searchIconUrl = '';
  @Input()
  public searchPlaceholder = '';
  @Input()
  public variant = '';

  @Output()
  public change: EventEmitter<any> = new EventEmitter();

  @ViewChild('searchInput')
  public searchInput: ElementRef;
  public config: PerfectScrollbarConfigInterface = { minScrollbarLength: 30 };
  public optionsList: IAdvancedSelectOption[] = [];
  public selectedOption: any = null;
  public selectedValues: IAdvancedSelectOption[] = [];
  private _documentClickListener = null;
  private _dropdownOpen = false;
  private _elementClickListener = null;
  private _preventClosing = false;
  private _searchedString = '';

  public propagateChange = any => {
    /* placeholder method */
  };
  public propagateTouched = any => {
    /* placeholder method */
  };

  // tslint:disable-next-line:member-ordering
  public constructor(private _element: ElementRef, private _ngZone: NgZone) {}

  public get filtrableOptions(): IAdvancedSelectOption[] {
    if (!this.optionsList || !this.optionsList.length) {
      return [];
    }
    return this.optionsList.filter(option => {
      if (!option.value) {
        option.label = this.allOption;
      }
      return true;
      // return this._searchedString && option.label
      //   ? option.label
      //       .toLowerCase()
      //       .indexOf(this._searchedString.toLowerCase()) !== -1
      //   : true;
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.options || changes.allOption) {
      if (this.allOption) {
        this.optionsList = [{ value: null, label: this.allOption }].concat(
          this.options.filter(item => item.label !== '')
        );
      } else {
        this.optionsList = [].concat(
          this.options.filter(item => item.label !== '')
        );
      }
    }
  }

  public ngAfterViewInit(): void {
    this._ngZone.runOutsideAngular(this._addClickListeners.bind(this));
  }

  public ngOnDestroy(): void {
    if (this._documentClickListener) {
      document.removeEventListener('click', this._documentClickListener);
    }
    if (this._elementClickListener) {
      this._element.nativeElement.removeEventListener(
        'click',
        this._elementClickListener
      );
    }
  }

  public toggleDropdown(): void {
    if (!this.disabled) {
      this._dropdownOpen ? this.close() : this.open();
    }
  }

  public open(): void {
    this._dropdownOpen = true;
    this._ngZone.runOutsideAngular(() => {
      if (this.searchInput) {
        setTimeout(() => {
          this.searchInput.nativeElement.focus();
        }, 300);
      }
    });
  }

  public close(): void {
    this._dropdownOpen = false;
    this.propagateTouched(true);
    this.clearFilter();
  }

  public isOpen(): boolean {
    return this._dropdownOpen;
  }

  public isDropdownOpen(): boolean {
    return this._dropdownOpen;
  }

  public async selectItem(option: IAdvancedSelectOption): Promise<void> {
    const optionValue = option ? option.value : null;
    const findIndex = _.findIndex(this.selectedValues, { value: option.value });
    if (findIndex > -1) {
      this.selectedValues.splice(findIndex, 1);
    } else {
      this.selectedValues.push(option);
    }
    this.selectedOption = option;
    if (
      (!optionValue && this.selectedOption) ||
      this.selectedValues.length === 0
    ) {
      this.selectedValues = [];
    }
    this.propagateChange(this.selectedValues);
    this.change.emit(this.selectedValues);
    // this.close();
  }

  public checkselectedValue(option: IAdvancedSelectOption) {
    return _.findIndex(this.selectedValues, { value: option.value }) > -1;
  }

  public filterList(str: string): void {
    this._searchedString = str;
  }

  public clearFilter(): void {
    this._searchedString = '';
    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
    }
  }

  public writeValue(value: any): void {
    if (value !== undefined) {
      const foundOptions = (this.optionsList || []).filter(option => {
        return option.value === value;
      });
      this.selectedOption = foundOptions.length ? foundOptions[0] : null;
    }
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(fn): void {
    this.propagateTouched = fn;
  }

  public validate(): null {
    // Always valid for now
    return null;
  }

  private _addClickListeners(): void {
    this._documentClickListener = this._onDocumentClick.bind(this);
    this._elementClickListener = this._onElementClick.bind(this);
    document.addEventListener('click', this._documentClickListener);
    this._element.nativeElement.addEventListener(
      'click',
      this._elementClickListener
    );
  }

  private _onDocumentClick(): void {
    if (this.isOpen() && !this._preventClosing) {
      this._ngZone.run(() => {
        this.close();
      });
    } else {
      this._preventClosing = false;
    }
  }

  private _onElementClick(): void {
    if (this.isOpen()) {
      this._preventClosing = true;
    }
  }
}
