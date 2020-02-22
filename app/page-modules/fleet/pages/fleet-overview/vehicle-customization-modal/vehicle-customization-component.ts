import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSelectChange } from '@angular/material';
import { UtilService } from '@services/util/util.service';
import { UserService } from '@services/user/user.service';
import { BrandNames, BrandColors } from '@enums/brand.enum';
import { FleetUserPreferencesService } from '@fleet/services/fleet-userpreferences/fleet-user-preferences.service';
import { FleetOverviewService } from '@fleet/pages/fleet-overview/services/fleet-overview-data/fleet-overview.service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'vehicle-customization',
  templateUrl: './vehicle-customization-component.html',
  styleUrls: ['./vehicle-customization-component.css']
})
export class VehicleCustomizationComponent implements OnInit {
  public static readonly componentName: string = 'CnhModalDataAccessInvite';
  public title: string;
  public buttonText = 'APPLY';
  public cancelText = 'CANCEL';
  dialogueParamsData: any;
  selectedOptions: any[] = [];
  customd: any;
  _refData: any;
  updatedUserPreferences: any;
  brand: string;
  param: any;
  panelClass: string;

  public constructor(
    private _dialogRef: MatDialogRef<VehicleCustomizationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private utilService: UtilService,
    private fleetOverviewService: FleetOverviewService,
    public utilservice: UtilService,
    private userService: UserService,
    private userPrefService: FleetUserPreferencesService
  ) {
    this._dialogRef.disableClose = true;
  }

  public ngOnInit(): void {
    if (this.data) {
      this._refData = this.data;
      this.title = this.data.title;
      this.buttonText = this.data.confirmButton;
      this.cancelText = this.data.cancelLabel || 'CANCEL';
      this.dialogueParamsData = this.data.allowedParams;
      this.customd = this.data.customdata;

      this.dialogueParamsData.forEach(element => {
        if (this.customd === 'CUSTOM 1') {
          this.param = {
            index: 1
          };
        } else {
          this.param = {
            index: 2
          };
        }
      });

      if (this.userService.getBrand() === BrandNames.NH) {
        this.panelClass = 'vehicle-customization nh';
      } else {
        this.panelClass = 'vehicle-customization cih';
      }
    }
  }

  optionSelected(selectedValue, vehicleCode) {
    this.selectedOptions.push({ vehicle: vehicleCode, code: selectedValue });
  }

  public onSubmit(): void {
    this._dialogRef.close(this.updatedUserPreferences);
  }

  public onCancel(): void {
    this._dialogRef.close();
  }

  public valueChange(event: MatSelectChange, item: any) {
    const prefs = this.fleetOverviewService._userPreferencesData;

    const updatedPref = prefs.canFamilyCodesPref.map(ele => {
      if (this.customd === 'CUSTOM 1' && item.code === ele.vehicleTypeCode) {
        if (ele.canFamilyCodes[0].index === 1) {
          ele.canFamilyCodes[0].code = event.value;
        } else {
          ele.canFamilyCodes[1].code = event.value;
        }
      }
      if (this.customd === 'CUSTOM 2' && item.code === ele.vehicleTypeCode) {
        if (ele.canFamilyCodes[0].index === 2) {
          ele.canFamilyCodes[0].code = event.value;
        } else {
          ele.canFamilyCodes[1].code = event.value;
        }
      }
      return ele;
    });

    this.updatedUserPreferences = { canFamilyCodesPref: updatedPref };

    this.userPrefService.updateUserPreferences(this.updatedUserPreferences);
  }

  getImageByName(name) {
    return this.utilService.getImageByName(name);
  }

  getBrandColor() {
    switch (this.userService.getBrand()) {
      case BrandNames.CIH:
        return BrandColors.CIH;

      case BrandNames.NH:
        return BrandColors.NH;

      default:
        break;
    }
  }

  public disableOption(name: string, item: any): boolean {
    if (this.customd === 'CUSTOM 1') {
      if (name === item.custom2SelectedParam) {
        return true;
      }
    } else {
      if (name === item.custom1SelectedParam) {
        return true;
      }
    }

    return false;
  }

  public optionLabel(name: string, item: any): string {
    let label = '';

    if (this.disableOption(name, item)) {
      if (this.customd === 'CUSTOM 1') {
        label = '(custom 2)';
      } else {
        label = '(custom 1)';
      }
    }

    return label;
  }
}
