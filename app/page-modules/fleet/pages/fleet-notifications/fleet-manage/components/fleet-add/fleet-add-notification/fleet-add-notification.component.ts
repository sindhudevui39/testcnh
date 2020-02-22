import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatHorizontalStepper } from '@angular/material';

import { switchMap } from 'rxjs/operators';
import * as _ from 'underscore';

import { FleetManageService } from '@fleet/pages/fleet-notifications/fleet-manage/services/fleet-manage.service';
import { FleetNotificationCloseModalComponent } from '../fleet-notification-close-modal/fleet-notification-close-modal.component';
import {
  FleetPostNotificationService,
  UserData
} from '../../../services/fleet-post-notification.service';
import { FleetVehicleUserService } from '../../../services/fleet-vehicle-user.service';
import { UserService } from '@services/user/user.service';

import { BrandColors, BrandNames } from '@enums/brand.enum';

const CONFIRM_BUTTON_TEXT = 'GLOBAL.CTA.CONFIRM';
const VEHICLE_BUTTON_TEXT = 'TROWSER.CUSTOM_NOTIFICATION.VEHICLES_SELECTION.TITLE';
const RULE_BUTTON_TEXT = 'TROWSER.CUSTOM_NOTIFICATION.RULE_CREATION.TITLE';
const NEXT_BUTTON_TEXT = 'GLOBAL.CTA.NEXT';
const OK_BUTTON_TEXT = 'GLOBAL.CTA.OK';

@Component({
  selector: 'app-fleet-add-notification',
  templateUrl: './fleet-add-notification.component.html',
  styleUrls: ['./fleet-add-notification.component.css']
})
export class FleetAddNotificationComponent implements OnInit {
  notificationName = new FormControl('', [Validators.required, this.noWhitespaceValidator]);
  brandColor: string;
  vehicleCount = 0;
  vehicleList = [];
  usersCount = 0;
  customRule = {};
  finalNotificationName = '';
  channel: string[];
  customParameter = '';
  customCondition = '';
  customDuration = '';
  customThreshold = '';
  ruleCreated = false;
  customthresholdValue = '';
  closePopup = false;
  vehicleSelect: any = false;
  success = true;
  currentStepIndex = 0;
  prevButtonText = '';
  nextButtonText = NEXT_BUTTON_TEXT;
  rule = true;
  disableNext: boolean;

  @ViewChild(MatHorizontalStepper)
  stepper: MatHorizontalStepper;

  constructor(
    @Inject(MAT_DIALOG_DATA) public editNotificationDetails: any,
    public dialogRef: MatDialogRef<FleetAddNotificationComponent>,
    public userService: UserService,
    private fleetPostNotificationService: FleetPostNotificationService,
    private fleetManageService: FleetManageService,
    private fleetVehicleService: FleetVehicleUserService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.brandColor = this.userService.getBrand() === 'Case IH' ? BrandColors.CIH : BrandColors.NH;

    this.disableNext = true;

    if (!_.isEmpty(this.editNotificationDetails)) {
      this.notificationName.setValue(this.editNotificationDetails.name);
      this.updateNotificationName();
    } else {
      this.notificationName.markAsTouched();
    }
  }

  onSelection(matstep) {
    this.fleetManageService.currentIndex$.next(matstep.selectedIndex);
  }

  onNoClick(afterPostCall?: string): void {
    const vehicleCount = this.fleetVehicleService.selectedVehicleIds$.getValue();
    const customNotification = this.fleetPostNotificationService.customNotificationData;
    const userListCount = this.fleetPostNotificationService.userData || [];
    if (vehicleCount) {
      if (
        (vehicleCount.length > 0 ||
          Object.keys(customNotification).length > 0 ||
          userListCount.length > 0) &&
        this.closePopup === false
      ) {
        this.closeNotification()
          .afterClosed()
          .subscribe(data => {
            if (!data) {
              this.vehicleSelect = false;
              this.fleetPostNotificationService.userData = [];
              this.fleetManageService.updateManagePage();
              this.dialogRef.close();
            }
          });
      } else {
        if (afterPostCall) {
          this.fleetVehicleService.selectedVehicleIds$.next([]);
          this.fleetPostNotificationService.userData = [];
          this.fleetPostNotificationService.customNotificationData = {};
        }
        this.fleetManageService.updateManagePage();
        this.dialogRef.close();
      }
    }
  }

  hasValueChecked(data) {
    this.vehicleSelect = data;
    this.enableNext();
  }

  selectedvehicleList(vehicles: any) {
    if (vehicles) {
      this.vehicleList = vehicles;
    }

    this.enableNext();
  }

  updateNotificationName() {
    this.fleetPostNotificationService.notificationName = this.notificationName.value;
  }

  disableButton(count?: number) {
    if (count || count === 0) {
      this.vehicleCount = count;
      this.fleetPostNotificationService.vehicleCount = this.vehicleCount;
    }

    this.enableNext();
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;

    return isValid ? null : { whitespace: true };
  }

  disableRuleCreationBtn(val: boolean) {
    this.rule = val;

    this.enableNext();
  }

  goBack() {
    this.currentStepIndex--;

    this.updateButtonText();
    this.enableNext();
    this.stepper.previous();
  }

  goForward() {
    this.currentStepIndex++;

    this.updateButtonText();
    this.stepper.next();
  }

  enableNext(): void {
    if (!this.isNotificationNameValid()) {
      this.disableNext = true;

      return;
    }

    switch (this.currentStepIndex) {
      case 0:
        if (this.vehicleCount > 0) {
          this.disableNext = false;
        } else {
          this.disableNext = true;
        }
        break;
      case 1:
        if (this.rule) {
          this.disableNext = true;
        } else {
          this.disableNext = false;
        }
        break;
      case 2:
        this.disableNext = false;
        break;
      case 3:
        this.disableNext = false;
        break;
    }
  }

  changeStep() {
    if (this.currentStepIndex === 0) {
      document
        .getElementsByClassName('mat-stepper-horizontal-line')[0]
        .setAttribute('style', 'border-top: 1.3px solid #219d37');

      this.goForward();
    } else if (this.currentStepIndex === 1) {
      document
        .getElementsByClassName('mat-stepper-horizontal-line')[1]
        .setAttribute('style', 'border-top: 1.3px solid #219d37');

      this.goForward();
    } else if (this.currentStepIndex === 2) {
      document
        .getElementsByClassName('mat-stepper-horizontal-line')[2]
        .setAttribute('style', 'border-top: 1.3px solid #219d37');

      this.postCustomNotification();
      this.goForward();
    } else if (this.currentStepIndex === 3) {
      document
        .getElementsByClassName('mat-stepper-horizontal-line')[0]
        .setAttribute('style', 'border-top: 1.3px solid #bbbbbb');

      document
        .getElementsByClassName('mat-stepper-horizontal-line')[1]
        .setAttribute('style', 'border-top: 1.3px solid #bbbbbb');

      document
        .getElementsByClassName('mat-stepper-horizontal-line')[2]
        .setAttribute('style', 'border-top: 1.3px solid #bbbbbb');

      this.onNoClick('afterPostCall');
    }

    this.updateButtonText();
  }

  private updateButtonText(): void {
    if (this.currentStepIndex === 0) {
      this.prevButtonText = '';
      this.nextButtonText = NEXT_BUTTON_TEXT;
    } else if (this.currentStepIndex === 1) {
      this.prevButtonText = VEHICLE_BUTTON_TEXT;
      this.nextButtonText = NEXT_BUTTON_TEXT;
    } else if (this.currentStepIndex === 2) {
      this.prevButtonText = RULE_BUTTON_TEXT;
      this.nextButtonText = CONFIRM_BUTTON_TEXT;
    } else if (this.currentStepIndex === 3) {
      this.prevButtonText = '';
      this.nextButtonText = OK_BUTTON_TEXT;
    }
  }

  closeNotification() {
    const dialogRef = this.dialog.open(FleetNotificationCloseModalComponent, {
      height: '196px',
      width: '400px',
      maxWidth: '80vw',
      data: {}
    });

    return dialogRef;
  }

  getTzOffsetValue() {
    let tzOffsetDate;

    tzOffsetDate = new Date();
    tzOffsetDate.getTimezoneOffset();

    return tzOffsetDate.getTimezoneOffset();
  }

  private isNotificationNameValid(): boolean {
    return !this.notificationName.value || this.notificationName.value.trim().length === 0
      ? false
      : true;
  }

  postCustomNotification() {
    const users = this.fleetPostNotificationService.userData || [];

    const newUserList = [];

    if (users.length > 0) {
      users.forEach(user => {
        if (!user.phone) {
          const newUser: UserData = {
            userId: user.userId,
            email: user.email,
            tzOffset: user.tzOffset,
            channel: user.channel
          };

          newUserList.push(newUser);
        } else {
          newUserList.push(user);
        }
      });
    }

    this.closePopup = true;

    const currentUser: UserData = {
      userId: this.userService.getUser().email,
      email: this.userService.getUser().email,
      tzOffset: 'UTC' ? this.getTzOffsetValue() : this.getTzOffsetValue(),
      channel: !_.isEmpty(this.editNotificationDetails)
        ? this.editNotificationDetails.channels
        : ['WEB']
    };

    if (this.userService.getUser().phone) {
      currentUser.phone = this.userService.getUser().phone;
    }

    newUserList.push(currentUser);

    this.fleetPostNotificationService
      .postCustomRule({ users: newUserList })
      .pipe(
        switchMap(resp => {
          const vehicleList = this.fleetPostNotificationService.vehicleList$.getValue();
          const vehicles = [];
          const canParameter = {
            notificationGroupId: resp.id,
            vehicles: this.fleetVehicleService.selectedVehicleIds$.getValue(),
            rule: {
              id: !_.isEmpty(this.editNotificationDetails) ? this.editNotificationDetails.id : null,
              type: 'PARAMETER',
              name: this.notificationName.value,
              canRule: {
                code: this.fleetPostNotificationService.customNotificationData['step2']['code'],
                condition: this.fleetPostNotificationService.customNotificationData['step3'][
                  'code'
                ],
                threshold: this.fleetPostNotificationService.customNotificationData['step4'],
                durationMs: this.fleetPostNotificationService.customNotificationData['step5']
              }
            }
          };
          return this.fleetPostNotificationService.postCan(canParameter);
        })
      )
      .subscribe(
        response => {
          this.success = true;
          this.finalNotificationName = this.notificationName.value;
          this.usersCount = users.length + 1;
          this.customRule = this.fleetPostNotificationService.customRule;
          this.customParameter = this.fleetPostNotificationService.customNotificationData['step2'][
            'name'
          ];
          this.customDuration = this.fleetPostNotificationService.customNotificationData['step5'];
          this.customthresholdValue = this.fleetPostNotificationService.customNotificationData[
            'step2'
          ]['unit'];
          this.customThreshold = this.fleetPostNotificationService.customNotificationData['step4'];
          this.customCondition = this.fleetPostNotificationService.customNotificationData['step3'][
            'name'
          ];
          this.channel = !_.isEmpty(this.editNotificationDetails)
            ? this.editNotificationDetails.channels
            : ['WEB'];
          this.ruleCreated = true;
        },
        error => {
          this.success = false;
        }
      );
  }
}
