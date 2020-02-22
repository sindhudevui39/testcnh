import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FleetPostNotificationService } from '@fleet/pages/fleet-notifications/fleet-manage/services/fleet-post-notification.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { UserService } from '@services/user/user.service';
import { Subscription } from 'rxjs';
import { FleetVehicleUserService } from '@fleet/pages/fleet-notifications/fleet-manage/services/fleet-vehicle-user.service';
import { MatDialog, _MatListItemMixinBase } from '@angular/material';
import * as _ from 'underscore';
import { FleetManageService } from '@fleet/pages/fleet-notifications/fleet-manage/services/fleet-manage.service';
import { FleetVehicleSelectionModalComponent } from '../fleet-vehicle-selection-modal/fleet-vehicle-selection-modal.component';

@Component({
  selector: 'app-fleet-vehicle-select',
  templateUrl: './fleet-vehicle-select.component.html',
  styleUrls: ['./fleet-vehicle-select.component.css'],
  animations: [
    trigger('hideNotification', [
      state(
        'collapsed',
        style({
          height: '0',
          minHeight: '0',
          overflow: 'hidden',
          display: 'none'
        })
      ),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('350ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class FleetVehicleSelectComponent implements OnInit, OnDestroy {
  @Output()
  vehicleCount = new EventEmitter<number>();
  vehiclesList: any;
  dataLoaded = false;
  isCollapsed = [];
  isCollapsedAll = false;
  companies: Array<any>;
  models: Array<any>;
  masterToggleChecked = false;
  masterIndeterminate = false;
  dataSelection = {};
  selectedValue = 0;
  collapse = 'COLLAPSE ALL';
  searchStringVechicle: string;
  beforeCheckedList: any = [];
  checkedList = {};
  dropdownTitle: string;
  allModels: string;
  @Input()
  vehicleSelect: boolean;
  companyDataToggle = false;
  ignorePopupModels = [];
  paramsSubscription: Subscription;
  selectedFleetValue = '';
  selectedModelValue = '';
  selectAll = false;
  checkVehicleList = 0;
  constructor(
    private fleetManageService: FleetManageService,
    private postNotification: FleetPostNotificationService,
    public userService: UserService,
    private _fleetVehicleService: FleetVehicleUserService,
    public dialog: MatDialog
  ) {}
  editSelectionWithID(rule) {
    this.postNotification.getSelectedVechicle(rule).subscribe(data => {
      data.forEach(selectedVechicle => {
        _.keys(this.vehiclesList).forEach(key => {
          this.vehiclesList[key].forEach(vehicle => {
            if (vehicle.id === selectedVechicle.id && selectedVechicle.selected) {
              this.toggleData({ checked: true }, key, vehicle);
            }
          });
        });
      });
    });
  }
  ngOnInit() {
    const { vehicles, all, allModels } = this.postNotification.translatedWords;

    this.dropdownTitle = `${vehicles} (${all})`;
    this.allModels = allModels;
    this.fleetManageService.currentIndex$.subscribe(index => {
      if (index === 0 && this.vehicleSelect) {
        this.ignorePopupModels = [];
      }
    });

    this.postNotification.defaultFleetTitle = this.dropdownTitle;
    this.postNotification.defaultModelTitle = this.allModels;

    this.postNotification.fleetDropdownTitle = this.dropdownTitle;
    this.postNotification.modelDropdownTitle = this.allModels;

    this.selectedFleetValue = this.postNotification.fleetDropdownTitle;
    this.selectedModelValue = this.postNotification.modelDropdownTitle;

    this.postNotification.vehicleList();
    let editTriggerFirstTime;

    this.paramsSubscription = this.postNotification.vehicleList$.subscribe(data => {
      if (data) {
        if (!_.isEmpty(this.fleetManageService.editNotificationDetails) && !editTriggerFirstTime) {
          editTriggerFirstTime = true;
          this.editSelectionWithID(
            _.pick(this.fleetManageService.editNotificationDetails, 'id', 'type')
          );
        }

        this.dataSelection = {};

        for (const key in data) {
          if (key) {
            this.dataSelection[key] = new SelectionModel<any>(true, []);
            this.isCollapsed.push(false);

            if (!this.dataLoaded) {
              this.checkedList[key] = [];
            }
          }
        }

        this.vehiclesList = data;

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

        // Destroying and recreating
        for (const key in data) {
          if (key) {
            const obj = {
              name: key
            };

            this.companies.push(obj);

            for (const val in data[key]) {
              if (val) {
                const obj1 = {
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
                  this.models.push(obj1);
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

        this.selectedFleetValue = this.postNotification.fleetDropdownTitle;
        this.selectedModelValue = this.postNotification.modelDropdownTitle;

        if (!this.dataLoaded) {
          this.dataLoaded = true;
        }

        this.setMasterCheckbox();
      }
    });
  }
  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
    this.postNotification.vehicleSelectionSearch({ searchString: '' });
    this.filterVehicles(this.companies[0], 'FLEET_DROPDOWN');
    this.filterVehicles(this.models[0], 'MODEL_DROPDOWN');
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
    let selectedIds = [];
    const previousSelectedModel = [];
    this.beforeCheckedList = [];

    for (const k in this.checkedList) {
      if (k) {
        this.checkedList[k].forEach(f => {
          this.beforeCheckedList.push(f);
        });
      }
    }

    if (!this.masterToggleChecked) {
      for (const k in this.vehiclesList) {
        if (k) {
          (this.vehiclesList[k] as Array<any>).forEach(f => {
            if (!this.vehicleSelect) {
              previousSelectedModel.push(f.model);
              this._fleetVehicleService.selectedVehicleModels$.next(previousSelectedModel);
            }
            selectedIds = selectedIds.filter((x, y) => selectedIds.indexOf(x) === y);
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
    this.addOrRemoveModel(true);
  }

  afterSelectAll() {
    let selectedLength = 0;
    let totalSetupsLength = 0;
    let selectedIds = [];
    const previousSelectedModel = [];
    this.beforeCheckedList = [];

    for (const k in this.checkedList) {
      if (k) {
        this.checkedList[k].forEach(f => {
          this.beforeCheckedList.push(f);
        });
      }
    }

    for (const k in this.vehiclesList) {
      if (k) {
        (this.vehiclesList[k] as Array<any>).forEach(f => {
          if (!this.vehicleSelect) {
            previousSelectedModel.push(f.model);
            this._fleetVehicleService.selectedVehicleModels$.next(previousSelectedModel);
          }
          selectedIds = selectedIds.filter((x, y) => selectedIds.indexOf(x) === y);
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

    this.addOrRemoveModel(true);

    this.selectAll = false;

    this.masterToggleChecked = true;
    this.masterIndeterminate = false;
  }

  dataToggle(key) {
    this.beforeCheckedList = [];
    for (const k in this.checkedList) {
      if (k) {
        this.checkedList[k].forEach(f => {
          this.beforeCheckedList.push(f);
        });
      }
    }
    if (key) {
      this.selectAll = false;
      if (this.isAllDataSelected(key)) {
        this.dataSelection[key].clear();
        this.checkedList[key] = [];
      } else {
        this.vehiclesList[key].forEach(row => this.dataSelection[key].select(row));
        this.checkedList[key] = [...this.vehiclesList[key]];
      }
    }

    this.addOrRemoveModel();
  }

  isAllDataSelected(key) {
    let numSelected: number;
    numSelected = this.dataSelection[key].selected.length;
    const numRows = this.vehiclesList[key].length;
    return numSelected === numRows;
  }

  toggleData($event, vehicleKey?, vehicleValue?) {
    this.beforeCheckedList = [];
    for (const k in this.checkedList) {
      if (k) {
        this.checkedList[k].forEach(f => {
          this.beforeCheckedList.push(f);
        });
      }
    }
    if ($event && $event.checked) {
      this.checkedList[vehicleKey].push(vehicleValue);
    } else {
      this.selectAll = false;
      for (let i = 0; i < this.checkedList[vehicleKey].length; i++) {
        const element = this.checkedList[vehicleKey][i];

        if (element.id === vehicleValue.id) {
          this.checkedList[vehicleKey].splice(i, 1);
        }
      }
    }
    const value = $event ? this.dataSelection[vehicleKey].toggle(vehicleValue) : null;

    this.addOrRemoveModel();
    this.selectedValue = this.vehiclesList[vehicleKey].length;
  }

  addOrRemoveModel(masterToggle = false) {
    if (
      this.vehicleSelect &&
      !this.companyDataToggle &&
      _.isEmpty(this.fleetManageService.editNotificationDetails)
    ) {
      // if (!this.companyDataToggle) {
      const currentSelecteddata = [];
      for (const k in this.checkedList) {
        if (k) {
          this.checkedList[k].forEach(f => {
            currentSelecteddata.push(f);
          });
        }
      }
      const previousSecure = _.union(_.pluck(this.beforeCheckedList, 'model'));
      const currentSecure = _.union(_.pluck(currentSelecteddata, 'model'));
      const selectedVehicle = this._fleetVehicleService.selectedVehicleModels$.getValue();
      if (previousSecure.length !== currentSecure.length) {
        if (previousSecure.length < currentSecure.length) {
          let addCount = 0;
          _.difference(currentSecure, previousSecure).forEach(f => {
            if (!_.contains(selectedVehicle, f)) {
              if (!_.contains(this.ignorePopupModels, f)) {
                addCount++;
                // this.ignorePopupModels.push(f);
              }
            }
          });
          if (addCount > 0) {
            const dialogRef = this.dialog.open(FleetVehicleSelectionModalComponent, {
              height: '240px',
              width: '442px',
              maxWidth: '80vw',
              data: {
                name:
                  'The selected vehicle(s) is a different vehicle model than the other vehicles selected. If you add it, you will lose your current notification rule.',
                id: 'true',
                model: '',
                buttonText: 'Add',
                header: 'Add Vehicle(s)?'
              }
            });
            dialogRef.afterClosed().subscribe(result => {
              if (result === 'true') {
                if (this.revertBackaddChanges()) {
                  this.setMasterCheckbox();
                }
              } else {
                _.difference(previousSecure, currentSecure).forEach(f => {
                  if (_.contains(selectedVehicle, f)) {
                    if (!_.contains(this.ignorePopupModels, f)) {
                      this.ignorePopupModels.push(f);
                    }
                  }
                });
                this.addintoList();
              }
            });
          }
          // this.addintoList();
        } else {
          let removedCount = 0;
          _.difference(previousSecure, currentSecure).forEach(f => {
            if (_.contains(selectedVehicle, f)) {
              if (!_.contains(this.ignorePopupModels, f)) {
                removedCount++;
                // this.ignorePopupModels.push(f);
              }
            }
          });
          if (removedCount > 0) {
            const dialogRef = this.dialog.open(FleetVehicleSelectionModalComponent, {
              height: '240px',
              width: '442px',
              maxWidth: '80vw',
              data: {
                name:
                  'The selected vehicle(s) is a different vehicle model than the other vehicles selected. If you remove it, you will lose your current notification rule.',
                id: 'true',
                model: '',
                buttonText: 'Remove',
                header: 'Remove Vehicle(s)?'
              }
            });
            dialogRef.afterClosed().subscribe(result => {
              if (result === 'true') {
                if (this.revertBackremoveChanges()) {
                  this.setMasterCheckbox();
                }
              } else {
                _.difference(previousSecure, currentSecure).forEach(f => {
                  if (_.contains(selectedVehicle, f)) {
                    if (!_.contains(this.ignorePopupModels, f)) {
                      this.ignorePopupModels.push(f);
                    }
                  }
                });
                this.addintoList();
              }
            });
          }
        }
      }
    }
    if (!masterToggle) {
      this.setMasterCheckbox();
    }
  }
  revertBackaddChanges() {
    for (const k in this.checkedList) {
      if (k) {
        this.checkedList[k].forEach(f => {
          if (_.findIndex(this.beforeCheckedList, { id: f.id }) === -1) {
            this.dataSelection[k].toggle(f);
          }
        });
        this.checkedList[k].forEach((f, index) => {
          if (_.findIndex(this.beforeCheckedList, { id: f.id }) === -1) {
            this.checkedList[k].splice(index, 1);
          }
        });
      }
    }
    return true;
  }
  revertBackremoveChanges() {
    for (const k in this.vehiclesList) {
      if (k) {
        for (let i = 0; i < this.vehiclesList[k].length; i++) {
          const element = this.vehiclesList[k][i];
          if (
            _.findIndex(this.beforeCheckedList, {
              id: element.id
            }) > -1
          ) {
            if (
              _.findIndex(this.checkedList[k], {
                id: element.id
              }) === -1
            ) {
              this.checkedList[k].push(element);
              this.dataSelection[k].toggle(element);
            }
          }
        }
      }
    }
    return true;
  }
  setMasterCheckbox() {
    let selectedLength = 0;
    let totalSetupsLength = 0;

    let selectedIds = [];
    const previousSelectedModel = [];
    // if (!this.vehicleSelect) {
    for (const k in this.checkedList) {
      if (k) {
        this.checkedList[k].forEach(f => {
          previousSelectedModel.push(f.model);
        });
      }
    }
    this._fleetVehicleService.selectedVehicleModels$.next(previousSelectedModel);
    // }
    for (const k in this.dataSelection) {
      if (k) {
        const selectedLength1 = this.dataSelection[k].selected.length;
        const totalSetupsLength1 = this.vehiclesList[k].length;
        selectedLength = selectedLength + selectedLength1;
        totalSetupsLength = totalSetupsLength + totalSetupsLength1;

        (this.dataSelection[k].selected as Array<any>).forEach(f => {
          selectedIds = selectedIds.filter((x, y) => selectedIds.indexOf(x) === y);
          selectedIds.push(f.id);
          if (this.vehicleSelect) {
            this._fleetVehicleService.familiesCount$.next(selectedIds.length);
          }
        });
      }
    }
    this._fleetVehicleService.selectedVehicleIds$.next(selectedIds);
    if (selectedLength === 0) {
      this.masterIndeterminate = false;
      this.masterToggleChecked = false;
    } else if (selectedLength < totalSetupsLength) {
      // this.masterToggleChecked = false;
      this.masterIndeterminate = true;
    } else {
      this.masterIndeterminate = false;
      this.masterToggleChecked = true;
    }

    this.selectedValue = selectedLength;
    this.vehicleCount.emit(this.selectedValue);
  }
  addintoList() {
    this._fleetVehicleService._selection.step2 = false;
    this._fleetVehicleService._selection.step3 = false;
    this._fleetVehicleService._selection.step4 = false;
    this._fleetVehicleService._selection.step5 = false;
    this._fleetVehicleService._currSelection.next(0);
    this._fleetVehicleService.resetParameter$.next(true);
  }

  public filterVehicles(event: any, dropdownType: string): void {
    this.postNotification.filterVehicleSelection(event, dropdownType);
  }

  public searchVehicles(event: any): void {
    const searchString = event.searchString;

    if (searchString) {
      this.searchStringVechicle = searchString.toLowerCase();
    } else {
      this.searchStringVechicle = searchString;
    }

    this.postNotification.vehicleSelectionSearch(event);
  }
}
