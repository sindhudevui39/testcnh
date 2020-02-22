import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import * as _ from 'underscore';
import { TranslateService } from '@ngx-translate/core';
import { FleetManageService } from '@fleet/pages/fleet-notifications/fleet-manage/services/fleet-manage.service';
import { FleetPostNotificationService } from '../../../services/fleet-post-notification.service';
import { FleetVehicleUserService } from '../../../services/fleet-vehicle-user.service';
@Component({
  selector: 'app-fleet-rule-creation',
  templateUrl: './fleet-rule-creation.component.html',
  styleUrls: ['./fleet-rule-creation.component.css']
})
export class FleetRuleCreationComponent implements OnInit, OnDestroy {
  @ViewChild('secondsValue') seconds: ElementRef;
  @ViewChild('unitValue') firstunitValue: ElementRef;
  @Output()
  disableRuleCreationBtn = new EventEmitter<boolean>(false);
  private _currSelection = 0;
  public _selection = this._fleetVehicleService._selection;
  public editterStepperDefaultValue = {};
  public selectedValueinStepper: any = {};
  private _step1Dropdown = [
    {
      name: this._fleetPostNotificationService.translatedWords.vehicleParameter
    }
  ];
  private _step2Dropdown = [];
  private _step3Dropdown = [];
  public editNotification = false;
  autoFocus = false;

  private _step3Map = new Map<string, Array<any>>();

  @Output()
  public _hasVehicleChecked = new EventEmitter<boolean>(false);
  _currentSelection = new EventEmitter<number>();

  private _ruleCreationData = {
    step2: {},
    step3: {},
    step4: null,
    step5: null
  };
  editApiCall = false;
  checkValue = false;
  private _unitValue = new FormControl('', [
    Validators.required,
    Validators.max(100),
    Validators.pattern(new RegExp('^(100|([0-9][0-9]?(.[0-9]+)?))$'))
  ]);
  private _secondsValue = new FormControl('', [
    Validators.required,
    Validators.pattern(new RegExp('^(100|([0-9][0-9]?(.[0-9]+)?))$'))
  ]);

  getErrorMessage() {
    return this._secondsValue.hasError('required')
      ? 'Not a Number'
      : this._secondsValue.hasError(`pattern`)
      ? 'Value below 0'
      : '';
  }

  getUnitErrorMessage() {
    return this._unitValue.hasError('required')
      ? 'No Key'
      : this._unitValue.hasError('pattern')
      ? 'Value below 0'
      : this._unitValue.hasError('max')
      ? 'Value Above 100'
      : '';
  }

  constructor(
    private fleetManageService: FleetManageService,
    private _fleetPostNotificationService: FleetPostNotificationService,
    private _fleetVehicleService: FleetVehicleUserService,
    public dialog: MatDialog,
    private readonly translate: TranslateService
  ) {}

  ngOnInit() {
    this._fleetVehicleService.resetParameter$.subscribe(values => {
      if (values) {
        this._currSelection = 1;
        this._selection['step2'] = false;
        this._selection['step3'] = false;
        this._selection['step4'] = false;
        this._selection['step5'] = false;
        this.translate
          .get(['TROWSER.CUSTOM_NOTIFICATION.RULE_CREATION.SELECT_PARAMETER'])
          .subscribe(res => {
            this.selectedValueinStepper.step2 =
              res['TROWSER.CUSTOM_NOTIFICATION.RULE_CREATION.SELECT_PARAMETER'];
          });
      }
    });
    this.fleetManageService.currentIndex$.subscribe(index => {
      if (index === 1) {
        this._hasVehicleChecked.emit(false);
      }
    });
    this._fleetVehicleService.updateSelection();
    this._selection = this._fleetVehicleService._selection;
    this.translate
      .get([
        'TROWSER.CUSTOM_NOTIFICATION.RULE_CREATION.START_CONDITION',
        'TROWSER.CUSTOM_NOTIFICATION.RULE_CREATION.SELECT_PARAMETER',
        'TROWSER.CUSTOM_NOTIFICATION.RULE_CREATION.SELECT_CONDITION'
      ])
      .subscribe(res => {
        this.selectedValueinStepper.step1 =
          res['TROWSER.CUSTOM_NOTIFICATION.RULE_CREATION.START_CONDITION'];
        this.selectedValueinStepper.step2 =
          res['TROWSER.CUSTOM_NOTIFICATION.RULE_CREATION.SELECT_PARAMETER'];
        this.selectedValueinStepper.step3 =
          res['TROWSER.CUSTOM_NOTIFICATION.RULE_CREATION.SELECT_CONDITION'];
      });
    this._unitValue.markAsTouched();
    this._secondsValue.markAsTouched();
    this._selection['step2'] = false;
    this._selection['step3'] = false;
    this._selection['step4'] = false;
    this._selection['step5'] = false;
    this.editApiCall = false;
    if (!_.isEmpty(this.fleetManageService.editNotificationDetails) && !this.editApiCall) {
      this.editNotification = true;
      this.fleetManageService.currentIndex$.subscribe(index => {
        if (index === 1 && !this.editApiCall) {
          this.editApiCall = true;
          this.changeStep(this._step1Dropdown[0], 1);
        }
      });
    }
  }
  ngOnDestroy() {
    this.editApiCall = false;
    // this.fleetManageService.currentIndex$.unsubscribe();
  }

  isPreviousSelection(i) {
    return this._selection[`step${i + 1}`];
  }

  isNextSelection(i) {
    if (i === this._currSelection + 1) {
      return true;
    } else {
      return false;
    }
  }

  changeStep(data, keyIndex) {
    if (keyIndex < 5) {
      this._currSelection = keyIndex;
    }

    switch (keyIndex) {
      case 1:
        if (!this._selection['step2']) {
          this._fleetVehicleService.selectedVehicleModelsAfterPost$.next(
            this._fleetVehicleService.selectedVehicleModels$.getValue()
          );
          const families = this._fleetVehicleService.selectedVehicleIds$.getValue();
          this._fleetPostNotificationService
            .postFamilies(families)
            .subscribe((response: Array<any>) => {
              this._hasVehicleChecked.emit(true);
              this._step2Dropdown = response.map(m => {
                this._step3Map.set(m.label, m.conditions);
                return {
                  name: m.label,
                  unit: !m.unit ? 'N/A' : m.unit,
                  code: m.code
                };
              });
              if (this._step2Dropdown.length === 0) {
                this._step2Dropdown = [
                  {
                    name: 'No options available'
                  }
                ];
              }
              if (
                !_.isEmpty(this.fleetManageService.editNotificationDetails) &&
                !this.editterStepperDefaultValue['step1']
              ) {
                const nextStepJson = this._step2Dropdown.filter(
                  f => f.code === this.fleetManageService.editNotificationDetails.canRule.code
                )[0];
                if (nextStepJson) {
                  this.changeStep(nextStepJson, 2);
                } else {
                  // this._step2Dropdown = [
                  //   {
                  //     name: 'No options available'
                  //   }
                  // ];
                  this.editNotification = false;
                }
                this.editterStepperDefaultValue['step1'] = true;
              }
              this._selection['step2'] = true;
              this.selectedValueinStepper.step1 = data.name;
            });
        } else {
          this._selection['step3'] = false;
          this._selection['step4'] = false;
          this._selection['step5'] = false;
        }

        break;
      case 2:
        if (this._selection['step4']) {
          this._selection['step4'] = false;
          this._unitValue.setValue('');
          this._secondsValue.setValue('');

          this._selection['step5'] = false;

          this._currSelection = 2;
        }

        this._ruleCreationData.step2 = { ...data };

        this._step3Dropdown = [];

        this._step3Dropdown = this._step3Map.get(data.name).map(m => ({ ...m, name: m.label }));
        this._step3Dropdown.forEach(m => {
          m.name = this.translate.instant('GLOBAL.CONDITION.' + m.code);
          // m.label = this.translate.instant('GLOBAL.CONDITION.' + m.code);
        });
        this._step3Dropdown = this._step3Dropdown.filter(f => f.code !== 'EQ');
        this._selection['step3'] = true;
        if (
          !_.isEmpty(this.fleetManageService.editNotificationDetails) &&
          !this.editterStepperDefaultValue['step2']
        ) {
          let step3filter = this._step3Dropdown.filter(
            f => f.label === this.fleetManageService.editNotificationDetails.canRule.condition
          )[0];
          if (_.isEmpty(step3filter)) {
            step3filter = this._step3Dropdown.filter(
              f => f.code === this.fleetManageService.editNotificationDetails.canRule.condition
            )[0];
          }
          if (!_.isEmpty(step3filter)) {
            this.changeStep(step3filter, 3);
          }

          this.editterStepperDefaultValue['step2'] = true;
        }
        this.selectedValueinStepper.step2 = data.name;
        break;
      case 3:
        if (this._selection['step5']) {
          this._selection['step5'] = false;
          this._currSelection = 3;
        }
        if (
          !_.isEmpty(this.fleetManageService.editNotificationDetails) &&
          !this.editterStepperDefaultValue['step3']
        ) {
          this._unitValue.setValue(
            this.fleetManageService.editNotificationDetails.canRule.threshold
          );
          this._secondsValue.setValue(
            this.fleetManageService.editNotificationDetails.canRule.durationMs
          );
          this.changeStep(this.fleetManageService.editNotificationDetails.canRule.threshold, 4);
          this.changeStep(this.fleetManageService.editNotificationDetails.canRule.durationMs, 5);
          setTimeout(() => {
            this.seconds.nativeElement.focus();
          }, 500);
          this.editterStepperDefaultValue['step3'] = true;
        }
        this._ruleCreationData.step3 = { ...data };
        this._selection['step4'] = true;
        this.selectedValueinStepper.step3 = data.name;
        setTimeout(() => {
          this.firstunitValue.nativeElement.focus();
        }, 200);
        break;
      case 4:
        let step4Val;
        if (_.isNumber(data)) {
          step4Val = data;
        } else if (data.target) {
          step4Val = Number(data.target.value);
        } else {
          step4Val = Number(data);
        }

        if (!isNaN(step4Val)) {
          this._ruleCreationData.step4 = Number(step4Val);
          this._selection['step5'] = true;
        }
        break;
      case 5:
        let step5Val;
        if (_.isNumber(data)) {
          step5Val = data;
        } else {
          step5Val = Number(data.target.value);
        }

        if (!step5Val || step5Val < 0) {
          this._ruleCreationData.step5 = null;
        } else {
          this._ruleCreationData.step5 = Number(step5Val) * 1000;
        }

        break;
    }

    if (this.validateInputs()) {
      this._fleetPostNotificationService.customRule = {
        code: this._ruleCreationData['step2']['unit'],
        condition: this._ruleCreationData['step3']['code'],
        threshold: this._ruleCreationData['step4'],
        durationMs: this._ruleCreationData['step5']
      };

      this._fleetPostNotificationService.customNotificationData = {
        ...this._ruleCreationData
      };

      this.disableRuleCreationBtn.emit(false);
    } else {
      this.disableRuleCreationBtn.emit(true);
    }
  }

  validateInputs(): boolean {
    let validInputCounter = 0;

    for (const key in this._ruleCreationData) {
      if (key) {
        const data = this._ruleCreationData[key];

        if (key === 'step2') {
          if ('unit' in data) {
            validInputCounter++;
          }
        } else if (key === 'step3') {
          if ('code' in data) {
            validInputCounter++;
          }
        } else if (key === 'step4') {
          let checkValue = false;
          if (this._ruleCreationData['step2']['unit'] === '%') {
            checkValue = data > 0 && data <= 100 ? true : false;
          } else {
            checkValue = true;
          }
          // else if (this._ruleCreationData['step2']['unit'] === 'RPM') {
          //   checkValue = data > 50 && data < 999 ? true : false;
          // }

          if (!isNaN(data) && data !== null && data !== 0 && checkValue) {
            validInputCounter++;
          }
        } else if (key === 'step5') {
          if (!isNaN(data) && data !== null) {
            validInputCounter++;
          }
        }
      }
    }
    return validInputCounter === 4 && this._currSelection === 4;
  }
}
