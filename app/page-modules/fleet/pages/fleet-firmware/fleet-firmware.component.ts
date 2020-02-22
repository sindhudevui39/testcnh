import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog, MatStepper } from '@angular/material';

import { FOTAApiService } from './services/fota-api.service';
import { FotaFilterService } from './services/fota-filter.service';
import { UserService } from '@services/user/user.service';

import { FleetFirmwareCloseModalComponent } from './components/fleet-firmware-close-modal/fleet-firmware-close-modal.component';

import { BrandColors } from '@enums/brand.enum';
import { DeviceNotificationEvent } from '@remote-display/rdv.enums';
import { FotaService } from './services/fota/fota.service';
import { filter, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

const CONFIRM_BUTTON_TEXT = 'GLOBAL.CTA.CONFIRM';
const FIRMWARE_BUTTON_TEXT = 'TROWSER.FOTA.STEP_NAME.FIRMWARE';
const NEXT_BUTTON_TEXT = 'GLOBAL.CTA.NEXT';
const OK_BUTTON_TEXT = 'GLOBAL.CTA.OK';

@Component({
  selector: 'app-fleet-firmware',
  templateUrl: './fleet-firmware.component.html',
  styleUrls: ['./fleet-firmware.component.css']
})
export class FleetFirmwareComponent implements OnInit {
  @ViewChild('stepper') private stepper: MatStepper;
  brandColor: string;
  isCampaignSelected = false;
  isVehicleSelected = false;
  vehicleListLoaded = false;
  vehicleCount = 0;
  closePopup = false;
  selectedCampaignId: string;
  selectedCampaignName: string;
  success = true;
  selectedVehicleIds: any[];
  confirmation = false;
  currentStepIndex = 0;
  prevButtonText = '';
  nextButtonText = NEXT_BUTTON_TEXT;

  constructor(
    public userService: UserService,
    private fotaApiService: FOTAApiService,
    private dialogRef: MatDialogRef<FleetFirmwareComponent>,
    private dialog: MatDialog,
    private fotaFilterService: FotaFilterService,
    private fotaService: FotaService
  ) {}

  ngOnInit() {
    this.brandColor = this.userService.getBrand() === 'Case IH' ? BrandColors.CIH : BrandColors.NH;
    this.fotaService.selectedVehicles$.subscribe(data => {
      this.selectedVehicleIds = this.fotaService.selectedVehicles;
      this.enableNext();
    });
  }

  campaignSelected(campaign: any) {
    this.selectedCampaignId = campaign.id;
    this.selectedCampaignName = campaign.name;

    this.isCampaignSelected = true;
  }

  vehiclesSelected(vehicleIds: any[]) {
    this.selectedVehicleIds = vehicleIds;

    if (vehicleIds.length === 0) {
      this.isVehicleSelected = false;
    } else {
      this.isVehicleSelected = true;
    }
  }

  changeStep() {
    if (this.currentStepIndex === 0) {
      this.vehicleListLoaded = true;

      document
        .getElementsByClassName('mat-stepper-horizontal-line')[0]
        .setAttribute('style', 'border-top: 1.3px solid #219d37');

      this.goForward();
    } else if (this.currentStepIndex === 1) {
      this.postSoftwareToVehicles();
    } else if (this.currentStepIndex === 2) {
      document
        .getElementsByClassName('mat-stepper-horizontal-line')[0]
        .setAttribute('style', 'border-top: 1.3px solid #bbbbbb');

      document
        .getElementsByClassName('mat-stepper-horizontal-line')[1]
        .setAttribute('style', 'border-top: 1.3px solid #bbbbbb');

      this.fotaFilterService.vehicleList = [];
      this.fotaFilterService.vehicleList$.next([]);
      this.selectedCampaignId = null;
      this.confirmation = false;
      this.fotaService.reset();
      this.dialogRef.close();
    }

    this.updateButtonText();
  }

  onNoClick(afterPostCall?: string): void {
    if (
      (this.selectedCampaignId || this.fotaService.selectedVehicles$.getValue().length !== 0) &&
      this.closePopup === false
    ) {
      this.closeNotification()
        .afterClosed()
        .subscribe(data => {
          if (!data) {
            this.dialogRef.close();
            this.fotaFilterService.vehicleList = [];
            this.fotaFilterService.vehicleList$.next([]);
            this.fotaService.reset();
          }
        });
    } else {
      if (afterPostCall) {
        this.fotaFilterService.vehicleList = [];
        this.fotaFilterService.vehicleList$.next([]);
        this.selectedCampaignId = null;
        this.confirmation = false;
      }
      this.dialogRef.close();
    }
  }

  vehicleClick(id: string) {
    this.fotaService.removeSelectedVehicle(id, true);
    this.selectedVehicleIds = this.fotaService.selectedVehicles;
  }

  closeNotification() {
    return this.dialog.open(FleetFirmwareCloseModalComponent, {
      height: '196px',
      width: '400px',
      maxWidth: '80vw'
    });
  }

  postSoftwareToVehicles() {
    const vehicleIds = this.fotaService.selectedVehicles$.getValue().map(vehicle => vehicle['id']);

    this.vehicleCount = vehicleIds.length;
    this.closePopup = true;

    const requestBody = this.fotaApiService.FOTAGetDeviceNotification(
      DeviceNotificationEvent.FOTA_START,
      vehicleIds
    );

    this.fotaApiService
      .FOTADeviceNotification(requestBody)
      .pipe(catchError(error => of<string>('FAILED')))
      .subscribe(response => {
        if (response === 'FAILED') {
          this.success = false;
        } else {
          this.success = true;
        }

        this.goForward();
      });
  }

  goBack() {
    this.currentStepIndex--;

    this.vehicleListLoaded = false;
    this.fotaFilterService.vehicleList = [];

    this.fotaFilterService.vehicleList$.next([]);
    this.fotaService.selectedVehicles$.next([]);
    this.selectedVehicleIds = [];
    this.isVehicleSelected = false;

    this.updateButtonText();
    this.fotaService.resetSelectedVehicles();
    this.stepper.previous();
  }

  goForward() {
    this.currentStepIndex++;
    if (this.currentStepIndex === 1) {
      this.fotaFilterService.vehicleList$.next(null);
    }
    if (this.currentStepIndex === 2) {
      this.confirmation = true;

      document
        .getElementsByClassName('mat-stepper-horizontal-line')[1]
        .setAttribute('style', 'border-top: 1.3px solid #219d37');
    }

    this.updateButtonText();
    this.stepper.next();
  }

  enableNext(): boolean {
    if (this.currentStepIndex === 0 && this.isCampaignSelected) {
      return true;
    } else if (this.currentStepIndex === 1 && this.selectedVehicleIds.length > 0) {
      return true;
    } else if (this.currentStepIndex === 2) {
      return true;
    }

    return false;
  }

  private updateButtonText(): void {
    if (this.currentStepIndex === 0) {
      this.prevButtonText = '';
      this.nextButtonText = NEXT_BUTTON_TEXT;
    } else if (this.currentStepIndex === 1) {
      this.prevButtonText = FIRMWARE_BUTTON_TEXT;
      this.nextButtonText = CONFIRM_BUTTON_TEXT;
    } else if (this.currentStepIndex === 2) {
      this.prevButtonText = '';
      this.nextButtonText = OK_BUTTON_TEXT;
    }
  }
}
