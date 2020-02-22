import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatSelectChange, MatSelect } from '@angular/material';

import { filter } from 'rxjs/operators';

import { ApiService } from '@services/api/api.service';
import { FOTAApiService } from '../../services/fota-api.service';
import { FotaFilterService } from '../../services/fota-filter.service';
import { FotaService } from '../../services/fota/fota.service';
import { UserService } from '@services/user/user.service';

import { BrandNames } from '@enums/brand.enum';
import { FleetFirmwareVehicleModalComponent } from '../fleet-firmware-vehicle-modal/fleet-firmware-vehicle-modal.component';
import { FOTAStatus, FOTAStatusResult } from '../../fleet-fota-properties';

export interface FirmwareStatusIcon {
  id: string;
}

@Component({
  selector: 'app-fleet-firmware-vehicle-selection',
  templateUrl: './fleet-firmware-vehicle-selection.component.html',
  styleUrls: ['./fleet-firmware-vehicle-selection.component.css']
})
export class FleetFirmwareVehicleSelectionComponent implements OnInit {
  @Input()
  selectedCampaignId: string;
  @Input()
  selectedCampaignName: string;
  @ViewChild('companySelect') companySelect: MatSelect;
  @ViewChild('vehicleSelect') vehicleSelect: MatSelect;
  @ViewChild('modelSelect') modelSelect: MatSelect;
  panelClass: string;
  selectedCompanyValue = 'all_companies';
  selectedVehicleValue = 'all_vehicles';
  selectedModelValue = 'all_models';
  searchString = '';

  dataLoaded = false;
  vehicleList = [];
  companies = [];
  vehicles = [];
  models = [];
  dataSelection: any = [];
  selectedTitle = 'installed';
  prevSelectedTitle = 'installed';
  isDesc = true;
  isAsc = false;
  titlesList: FirmwareStatusIcon[] = [];
  isDataEmpty = false;

  constructor(
    private fotaApiService: FOTAApiService,
    private fotaFilterService: FotaFilterService,
    private apiService: ApiService,
    public dialog: MatDialog,
    private userService: UserService,
    private fotaService: FotaService
  ) {}

  ngOnInit() {
    this.dataLoaded = false;

    if (this.userService.getBrand() === BrandNames.NH) {
      this.panelClass = 'fota nh';
    } else {
      this.panelClass = 'fota cih';
    }

    this.fotaFilterService.selectedCompany = this.selectedCompanyValue;
    this.fotaFilterService.selectedVehicle = this.selectedVehicleValue;
    this.fotaFilterService.selectedModel = this.selectedModelValue;

    this.fotaFilterService.defaultCompanyValue = this.selectedCompanyValue;
    this.fotaFilterService.defaultVehicleValue = this.selectedVehicleValue;
    this.fotaFilterService.defaultModelValue = this.selectedModelValue;

    this.fotaFilterService.searchString = this.searchString;

    this.titlesList.push({ id: 'notified' });
    this.titlesList.push({ id: 'downloaded' });
    this.titlesList.push({ id: 'installed' });

    this.dataSelection = [];

    this.fotaFilterService.vehicleList$.subscribe(list => {
      if (list) {
        this.dataLoaded = true;
        this.setupData(list);
        if (list.length > 0) {
          this.isDataEmpty = false;
        } else {
          this.isDataEmpty = true;
        }
      } else {
        this.setupData([]);
      }
    });

    this.fotaService.vehicleRemoved$.pipe(filter(data => data && data.summary)).subscribe(data => {
      this.dataSelection.toggle(this.vehicleList.find(f => f.id === data.vehicle.id));
    });

    this.fotaApiService
      .campaignById(this.selectedCampaignId)
      .pipe(filter(data => data))
      .subscribe(
        data => {
          data.forEach(element => {
            this.apiService.getVehicleDataById(element.id).subscribe((vehicleDetails: any) => {
              const vehicle = {
                id: vehicleDetails.id,
                campaignName: this.selectedCampaignName,
                companyName: vehicleDetails.fleets[0].name,
                model: vehicleDetails.model,
                vehicleName: vehicleDetails.name,
                result: element.result,
                status: element.status,
                active: element.active,
                activeCampaign: element.activeCampaign,
                statusImgUrls: this.getSoftwareStatusImage(element)
              };

              this.fotaFilterService.vehicleList.push(vehicle);
              this.fotaFilterService.vehicleList$.next(this.fotaFilterService.vehicleList);
            });
          });
        },
        error => console.log(error)
      );
  }

  private setupData(list: any[]): void {
    this.companies = [];
    this.vehicles = [];
    this.models = [];
    this.vehicleList = list;

    for (const index in this.vehicleList) {
      if (index) {
        this.setupDropdown(this.vehicleList[index].companyName, this.companies);
        this.setupDropdown(this.vehicleList[index].vehicleName, this.vehicles);
        this.setupDropdown(this.vehicleList[index].model, this.models);
      }
    }

    this.dataSelection = new SelectionModel<any>(true, []);
  }

  private setupDropdown(name: string, arr: any[]): void {
    let isNamePresent = false;

    for (let i = 0; i < arr.length; i++) {
      if (arr[i].name === name) {
        isNamePresent = true;

        break;
      }
    }

    if (!isNamePresent) {
      arr.push({ name });
    }
  }

  getSoftwareStatusImage(element) {
    const imageUrl = 'assets/svg/firmware/not-notified.svg';

    const imageUrls = {
      notified: imageUrl,
      downloaded: imageUrl,
      installed: imageUrl
    };

    if (element.status === FOTAStatus.NOTIFIED) {
      imageUrls.notified = 'assets/svg/firmware/confirmation.svg';
    } else if (element.status === FOTAStatus.DOWNLOADED) {
      imageUrls.notified = 'assets/svg/firmware/confirmation.svg';

      if (element.result === FOTAStatusResult.SUCCESS) {
        imageUrls.downloaded = 'assets/svg/firmware/confirmation.svg';
      } else if (element.result === FOTAStatusResult.FAILURE) {
        imageUrls.downloaded = 'assets/svg/firmware/close.svg';
      }
    } else if (element.status === FOTAStatus.INSTALLED) {
      imageUrls.notified = 'assets/svg/firmware/confirmation.svg';
      imageUrls.downloaded = 'assets/svg/firmware/confirmation.svg';

      if (element.result === FOTAStatusResult.SUCCESS) {
        imageUrls.installed = 'assets/svg/firmware/confirmation.svg';
      } else if (element.result === FOTAStatusResult.FAILURE) {
        imageUrls.installed = 'assets/svg/firmware/close.svg';
      }
    } else if (element.status === FOTAStatus.CANCELED) {
      imageUrls.notified = 'assets/svg/firmware/confirmation.svg';
      imageUrls.downloaded = 'assets/svg/firmware/confirmation.svg';
      imageUrls.installed = 'assets/svg/firmware/close.svg';
    }

    return imageUrls;
  }

  toggleData($event, vehicle) {
    if ($event && $event.checked) {
      this.fotaService.vehicleSelected({ id: vehicle.id, name: vehicle.vehicleName });
    } else {
      this.fotaService.removeSelectedVehicle(vehicle.id);
    }

    this.dataSelection.toggle(this.vehicleList.find(f => f.id === vehicle.id));
    this.vehicleModalPopup();
  }

  vehicleModalPopup() {
    let dialogRef;

    if (this.fotaService.selectedVehicles$.getValue().length > 500) {
      dialogRef = this.dialog.open(FleetFirmwareVehicleModalComponent, {
        height: '196px',
        width: '448px',
        maxWidth: '80vw',
        data: {}
      });
    }

    return dialogRef;
  }

  isAllSelected() {
    const numSelected = this.dataSelection.selected.length;
    const numRows = this.vehicleList.length;

    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.dataSelection.clear();
      this.fotaService.removeAllVehicles();
    } else {
      this.fotaService.selectAllVehicles(
        this.vehicleList.map(m => ({ id: m.id, name: m.vehicleName }))
      );
      this.vehicleList.forEach(row => this.dataSelection.select(row));
    }

    this.vehicleModalPopup();
  }

  onTitleCLick(id) {
    this.selectedTitle = id;

    if (id === this.prevSelectedTitle && !this.isDesc) {
      this.isAsc = false;
      this.isDesc = true;
      this.fotaFilterService.sortBy(id, true, this.vehicleList);
      this.fotaFilterService.selectedOrder = true;
    } else {
      this.isAsc = true;
      this.isDesc = false;
      this.fotaFilterService.sortBy(id, false, this.vehicleList);
      this.fotaFilterService.selectedOrder = false;
    }

    this.fotaFilterService.selectedAttr = id;
    this.prevSelectedTitle = id;
  }

  filterVehicles(event: MatSelectChange, dropdownType: string): void {
    this.fotaFilterService.filterVehicleSelection(event, dropdownType);
  }

  searchVehicle(event: any): void {
    const searchString = event.searchString;

    if (searchString) {
      this.searchString = searchString.toLowerCase();
    } else {
      this.searchString = '';
    }

    if (this.fotaFilterService.vehicleSelectionSearch(this.searchString)) {
      this.companySelect.value = 'all_companies';
      this.vehicleSelect.value = 'all_vehicles';
      this.modelSelect.value = 'all_models';
    }
  }
}
