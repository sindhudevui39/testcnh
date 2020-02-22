import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import { BrandNames, BrandColors } from '@enums/brand.enum';
import { UserService } from '@services/user/user.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FleetVehicleSelectComponent } from '../fleet-vehicle-select/fleet-vehicle-select.component';
import { FleetVehicleUserService } from '../../../services/fleet-vehicle-user.service';

export interface DialogData {
  name?: string;
  model?: string;
  id: string;
  buttonText: string;
  header: string;
}

@Component({
  selector: 'app-fleet-vehicle-selection-modal',
  templateUrl: './fleet-vehicle-selection-modal.component.html',
  styleUrls: ['./fleet-vehicle-selection-modal.component.css']
})
export class FleetVehicleSelectionModalComponent implements OnInit {
  public brand: string;
  brands = BrandNames;
  buttonBGColor: string;

  selectedVehicleModels = [];
  selectId: string = null;
  @Output()
  public _hasVehicleChecked = new EventEmitter<boolean>();
  // @Output()
  // public unCheckVehicle$ = new EventEmitter<string>();

  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<FleetVehicleSelectComponent>,
    public _fleetVehicleService: FleetVehicleUserService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit() {
    this.brand = this.userService.getBrand();
    this.buttonBGColor =
      this.userService.getBrand() === BrandNames.CIH ? BrandColors.CIH : BrandColors.NH;

    this.selectedVehicleModels = this._fleetVehicleService.selectedVehicleModels$.getValue();
  }

  onNoClick(id: string) {
    this.selectId = id;
    this.dialogRef.close(this.selectId);
  }

  AddVehicleToList(model, buttonText) {
    if (buttonText === 'Add') {
      this.selectedVehicleModels.push(model);
      this.selectedVehicleModels = this.selectedVehicleModels.filter(
        (x, y) => this.selectedVehicleModels.indexOf(x) === y
      );
      this._fleetVehicleService.selectedVehicleModelsAfterPost$.next(this.selectedVehicleModels);
    } else {
      const index: number = this.selectedVehicleModels.indexOf(model);
      if (index !== -1) {
        this.selectedVehicleModels.splice(index, 1);
      }
      this._fleetVehicleService.selectedVehicleModelsAfterPost$.next(this.selectedVehicleModels);
    }
  }
}
