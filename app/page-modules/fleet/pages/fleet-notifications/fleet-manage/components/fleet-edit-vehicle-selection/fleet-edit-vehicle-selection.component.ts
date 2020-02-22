import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { UserService } from '@services/user/user.service';
import { FleetVehicleUserService } from '@fleet/pages/fleet-notifications/fleet-manage/services/fleet-vehicle-user.service';
import { BrandColors } from '@enums/brand.enum';
import { SelectionModel } from '@angular/cdk/collections';
import { FleetEditVehicleSelectionService } from '@fleet/pages/fleet-notifications/fleet-manage/services/fleet-edit-vehicle-selection.service';
import { FleetPostNotificationService } from '@fleet/pages/fleet-notifications/fleet-manage/services/fleet-post-notification.service';

@Component({
  selector: 'app-fleet-edit-vehicle-selection',
  templateUrl: './fleet-edit-vehicle-selection.component.html',
  styleUrls: ['./fleet-edit-vehicle-selection.component.css'],
  animations: [
    trigger('hideNotification', [
      state(
        'collapsed',
        style({
          height: '0',
          minHeight: '0',
          display: 'none',
          overflow: 'hidden'
        })
      ),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('350ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class FleetEditVehicleSelectionComponent implements OnInit, OnDestroy {
  _phoneNumberStatus: boolean;
  disabled = false;
  afterAllSelected = true;

  @Input()
  set phoneNumberStatus(value: boolean) {
    if (!value) {
      this.disabled = true;
      this.disableConfirmBtn.emit(false);
    } else {
      this.disabled = false;
      this._phoneNumberStatus = value;

      this.checkConfirmStatus();
    }
  }

  @Output()
  vehicleCount = new EventEmitter<number>();

  @Output()
  checkPhoneNumber = new EventEmitter<boolean>();

  @Output()
  disableConfirmBtn = new EventEmitter<boolean>();

  selectedvehicles = new EventEmitter<any>();
  public vehiclesList: any;
  dataLoaded = false;
  isCollapsed = [];
  isCollapsedAll = false;
  customd: any;
  companies: Array<any>;
  models: Array<any>;
  masterToggleChecked = false;
  masterIndeterminate = false;
  dataSelection = {};
  selectedValue = 0;
  collapse = 'COLLAPSE ALL';
  searchStringVechicle: string;
  dropdownTitle: string;
  allModels: string;
  selectedFleetValue = '';
  selectedModelValue = '';
  selectAll = false;
  checkVehicleList = 0;
  checkedList = {};

  constructor(
    private editVehicleSelection: FleetEditVehicleSelectionService,
    public userService: UserService,
    private _fleetVehicleService: FleetVehicleUserService,
    private _fleetPostNotification: FleetPostNotificationService
  ) {}
  ngOnDestroy() {
    this.editVehicleSelection.vehicleSelectionSearch({ searchString: '' });
  }
  ngOnInit() {
    const { vehicles, all, allModels } = this._fleetPostNotification.translatedWords;
    this.dropdownTitle = `${vehicles} (${all})`;
    this.allModels = allModels;

    this.editVehicleSelection.defaultFleetTitle = this.dropdownTitle;
    this.editVehicleSelection.defaultModelTitle = this.allModels;

    this.editVehicleSelection.fleetDropdownTitle = this.dropdownTitle;
    this.editVehicleSelection.modelDropdownTitle = this.allModels;

    this.selectedFleetValue = this.editVehicleSelection.fleetDropdownTitle;
    this.selectedModelValue = this.editVehicleSelection.modelDropdownTitle;
    this.editVehicleSelection.vehicleList();

    this.editVehicleSelection.vehicleList$.subscribe(data => {
      if (data) {
        this.dataSelection = {};
        this.vehiclesList = { ...data };

        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            this.checkVehicleList = this.vehiclesList[key].length;
          }
        }
        this.companies = [
          {
            name: this.dropdownTitle,
            id: 'all_fleets'
          }
        ];
        this.models = [{ name: this.allModels, id: 'all_models' }];

        for (const key in data) {
          if (key) {
            this.dataSelection[key] = new SelectionModel<any>(true, []);
            this.isCollapsed.push(false);

            if (!this.dataLoaded) {
              this.checkedList[key] = [];
            }

            const companyObj = {
              name: key
            };

            this.companies.push(companyObj);

            // Add items to check
            this.checkedList[key] = data[key].filter(f =>
              this._fleetPostNotification.getFaultNotificationList().includes(f.id)
            );

            if (this.checkedList[key].length > 0) {
              this.checkPhoneNumber.emit(true);
            }

            for (const val in data[key]) {
              if (val) {
                const modelObj = {
                  name: data[key][val].model
                };

                let isModelPresent = false;

                for (let i = 0; i < this.models.length; i++) {
                  if (this.models[i].name === data[key][val].model) {
                    isModelPresent = true;

                    break;
                  }
                }

                if (!isModelPresent) {
                  this.models.push(modelObj);
                }

                for (let i = 0; i < this.checkedList[key].length; i++) {
                  const element = this.checkedList[key][i];

                  if (this.vehiclesList[key][val].id === element.id) {
                    this.dataSelection[key].toggle(this.vehiclesList[key][val]);
                    break;
                  }
                }
              }
            }
          }
        }

        this.selectedFleetValue = this.editVehicleSelection.fleetDropdownTitle;
        this.selectedModelValue = this.editVehicleSelection.modelDropdownTitle;

        if (!this.dataLoaded) {
          this.dataLoaded = true;
        }

        this.setMasterCheckbox();
      }
    });
  }

  collapsedAll(i?) {
    if (i || i === 0) {
      // Collapse/Expand individual
      this.isCollapsed[i] = !this.isCollapsed[i];
    } else {
      // Collapse/Expand all
      if (this.collapse === 'COLLAPSE ALL') {
        this.isCollapsed.forEach((item, index) => {
          this.isCollapsed[index] = true;
        });
      } else {
        this.isCollapsed.forEach((item, index) => {
          this.isCollapsed[index] = false;
        });
      }
    }

    let count = 0;

    for (let idx = 0; idx < this.isCollapsed.length; idx++) {
      if (this.isCollapsed[idx]) {
        count++;
      }
    }

    if (count > 0) {
      this.collapse = 'EXPAND ALL';
    } else {
      this.collapse = 'COLLAPSE ALL';
    }
  }

  masterToggle() {
    let selectedLength = 0;
    let totalSetupsLength = 0;
    const selectedIds = [];

    if (!this.masterToggleChecked) {
      for (const k in this.vehiclesList) {
        if (k) {
          (this.vehiclesList[k] as Array<any>).forEach(f => {
            selectedIds.push(f.id);
          });

          this.vehiclesList[k].forEach(row => this.dataSelection[k].select(row));

          const selectedLength1 = this.dataSelection[k].selected.length;
          const totalSetupsLength1 = this.vehiclesList[k].length;

          selectedLength = selectedLength + selectedLength1;
          totalSetupsLength = totalSetupsLength + totalSetupsLength1;
        }
      }

      this.selectedValue = selectedLength;
    } else {
      for (const k in this.vehiclesList) {
        if (k) {
          this.vehiclesList[k].forEach(row => this.dataSelection[k].clear(row));
          this.selectedValue = 0;
          selectedIds.push();
        }
      }
    }
    this._fleetVehicleService.selectedVehicleIds$.next(selectedIds);

    this.vehicleCount.emit(this.selectedValue);
    this.masterToggleChecked = !this.masterToggleChecked;

    if (!this.masterToggleChecked) {
      for (const k in this.checkedList) {
        if (this.checkedList.hasOwnProperty(k)) {
          this.checkedList[k] = [];
        }
      }
    } else {
      for (const k in this.checkedList) {
        if (this.checkedList.hasOwnProperty(k)) {
          this.checkedList[k] = [...this.vehiclesList[k]];
        }
      }
    }
    this.checkConfirmStatus();
    this.setVehicleNotification();
  }

  afterSelectAll() {
    let selectedLength = 0;
    let totalSetupsLength = 0;
    const selectedIds = [];

    for (const k in this.vehiclesList) {
      if (k) {
        (this.vehiclesList[k] as Array<any>).forEach(f => {
          selectedIds.push(f.id);
        });

        this.vehiclesList[k].forEach(row => this.dataSelection[k].select(row));

        const selectedLength1 = this.dataSelection[k].selected.length;
        const totalSetupsLength1 = this.vehiclesList[k].length;

        selectedLength = selectedLength + selectedLength1;
        totalSetupsLength = totalSetupsLength + totalSetupsLength1;
      }
    }

    this.selectedValue = selectedLength;

    this._fleetVehicleService.selectedVehicleIds$.next(selectedIds);

    this.vehicleCount.emit(this.selectedValue);
    this.masterToggleChecked = !this.masterToggleChecked;

    for (const k in this.checkedList) {
      if (this.checkedList.hasOwnProperty(k)) {
        this.checkedList[k] = [...this.vehiclesList[k]];
      }
    }
    this.checkConfirmStatus();
    this.setVehicleNotification();

    this.selectAll = false;

    this.masterToggleChecked = true;
    this.masterIndeterminate = false;
  }

  dataToggle(key) {
    if (key) {
      if (this.isAllDataSelected(key)) {
        this.dataSelection[key].clear();
        this.checkedList[key] = [];
      } else {
        this.vehiclesList[key].forEach(row => this.dataSelection[key].select(row));
        this.checkedList[key] = [...this.vehiclesList[key]];
      }
    }

    this.setMasterCheckbox();
  }

  isAllDataSelected(key) {
    let numSelected: number;
    numSelected = this.dataSelection[key].selected.length;
    const numRows = this.vehiclesList[key].length;
    return numSelected === numRows;
  }

  toggleData($event, vehicleKey, vehicleValue) {
    if ($event && $event.checked) {
      this.checkedList[vehicleKey].push(vehicleValue);
    } else {
      for (let i = 0; i < this.checkedList[vehicleKey].length; i++) {
        const element = this.checkedList[vehicleKey][i];

        if (element.id === vehicleValue.id) {
          this.checkedList[vehicleKey].splice(i, 1);
        }
      }
    }

    const value = $event ? this.dataSelection[vehicleKey].toggle(vehicleValue) : null;

    this.setMasterCheckbox();
    this.selectedValue = this.vehiclesList[vehicleKey].length;
  }

  setMasterCheckbox() {
    let selectedLength = 0;
    let totalSetupsLength = 0;

    const selectedIds = [];

    for (const k in this.dataSelection) {
      if (k) {
        const selectedLength1 = this.dataSelection[k].selected.length;
        const totalSetupsLength1 = this.vehiclesList[k].length;
        selectedLength = selectedLength + selectedLength1;
        totalSetupsLength = totalSetupsLength + totalSetupsLength1;

        (this.dataSelection[k].selected as Array<any>).forEach(f => {
          selectedIds.push(f.id);
        });
      }
    }

    this._fleetVehicleService.selectedVehicleIds$.next(selectedIds);

    if (selectedLength === 0) {
      this.masterIndeterminate = false;
      this.masterToggleChecked = false;
    } else if (selectedLength < totalSetupsLength) {
      this.masterIndeterminate = true;
    } else {
      this.masterIndeterminate = false;
      this.masterToggleChecked = true;
    }

    this.selectedValue = selectedLength;
    this.vehicleCount.emit(this.selectedValue);
    this.checkConfirmStatus();
    this.setVehicleNotification();
  }

  public filterVehicles(event: any, dropdownType: string): void {
    this.editVehicleSelection.filterVehicleSelection(event, dropdownType);
  }

  public searchVehicles(event: any): void {
    const searchString = event.searchString;

    if (searchString) {
      this.searchStringVechicle = searchString.toLowerCase();
    } else {
      this.searchStringVechicle = searchString;
    }

    this.editVehicleSelection.vehicleSelectionSearch(event);
  }

  checkConfirmStatus() {
    if (this._phoneNumberStatus) {
      let checkedCount = 0;

      for (const key in this.checkedList) {
        if (this.checkedList[key].length > 0) {
          checkedCount++;
        }
      }

      if (checkedCount === 0) {
        this.disableConfirmBtn.emit(true);
      } else {
        this.disableConfirmBtn.emit(false);
      }
    }
  }

  setVehicleNotification() {
    const vehiclesNotificationList = [];

    for (const key in this.checkedList) {
      if (key) {
        this.checkedList[key].forEach(f => {
          vehiclesNotificationList.push({
            id: f.id,
            channel: ['WEB', 'SMS']
          });
        });
      }
    }

    this.editVehicleSelection.setVehiclesNotification(vehiclesNotificationList);
  }
}
