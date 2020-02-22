import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import { MatHorizontalStepper } from '@angular/material';
import { Subject, Subscription } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material';
import {
  CnhTrowserService,
  TROWSER_DATA
} from '../../services/data-access-setup-service';
import { CnhSnackBarService } from '../../services/cnh-snack-bar.service';
import { DataAccessClientsService } from '../../services/data-access.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '@services/user/user.service';
import { TranslateService } from '@ngx-translate/core';

import {
  CnhModalComponent,
  IModalData,
  CnhThemeColor
} from '../../../Connections/components/cnh-modal/cnh-modal.component';

enum StepType {
  ALL,
  SPECIFIC
}

enum SpecificStepsName {
  DATATYPE,
  FIELDS,
  OPERATIONS,
  CONFIRM
}

enum AllStepsName {
  DATATYPE,
  CONFIRM
}

@Component({
  selector: 'cnh-trowser-data-sharing',
  templateUrl: './cnh-trowser-data-sharing.component.html',
  styleUrls: ['./cnh-trowser-data-sharing.component.css']
})
export class CnhTrowserDataSharingComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  protected subscriptions: Set<Subscription> = new Set();
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  public brand = '';
  public anyoneSelect = false;
  public selectedOperations: any = [
    {
      name: 'PLANTING',
      styles: {
        iconField: 'planting.svg',
        iconSimple: 'planting.svg',
        iconSimpleLighter: 'planting_lighter.svg',
        color: '#239546'
      },
      label: this.translate.instant('GLOBAL.OPERATIONS.PLANTING')
    },
    {
      name: 'SEEDING',
      styles: {
        iconField: 'planting.svg',
        iconSimple: 'planting.svg',
        iconSimpleLighter: 'planting_lighter.svg',
        color: '#239546'
      },
      label: this.translate.instant('GLOBAL.OPERATIONS.SEEDING')
    },
    {
      name: 'SPRAYING',
      styles: {
        iconField: 'spraying.svg',
        iconSimple: 'spraying.svg',
        iconSimpleLighter: 'spraying_lighter.svg',
        color: '#439de6'
      },
      label: this.translate.instant('GLOBAL.OPERATIONS.SPRAYING')
    },
    {
      name: 'SPREADING',
      styles: {
        iconField: 'spreading.svg',
        iconSimple: 'spreading.svg',
        iconSimpleLighter: 'spreading_lighter.svg',
        color: '#7858ba'
      },
      label: this.translate.instant('GLOBAL.OPERATIONS.SPREADING')
    },
    {
      name: 'HARVESTING',
      styles: {
        iconField: 'harvesting.svg',
        iconSimple: 'harvesting.svg',
        iconSimpleLighter: 'harvesting_lighter.svg',
        color: '#d5a740'
      },
      label: this.translate.instant('GLOBAL.OPERATIONS.HARVESTING')
    }
    // {
    //   name: 'SWATHING',
    //   styles: {
    //     iconField: 'swathing.svg',
    //     iconSimple: 'swathing.svg',
    //     iconSimpleLighter: 'swathing_lighter.svg',
    //     color: '#da762c'
    //   },
    //   label: 'Swathing'
    // },
    // {
    //   name: 'TILLAGE',
    //   styles: {
    //     iconField: 'tillage.svg',
    //     iconSimple: 'tillage.svg',
    //     iconSimpleLighter: 'tillage_lighter.svg',
    //     color: '#705339'
    //   },
    //   label: 'Tillage'
    // }
  ];
  public AlloperationData;
  any = [];
  public allOrSelectedField = true;
  public title = '';
  public info = '';
  public notes = '';
  public values: string[] = [];
  public buttonText: string;
  public backButtonText: string;
  public stepType: number = StepType.ALL;
  public selectedIndex: number = AllStepsName.DATATYPE;
  public selectedFields: any[] = [];
  public hasSetupData = false;
  public makeSelection = false;
  public loadedFieldValue = true;
  @ViewChild('stepper')
  private stepper: MatHorizontalStepper;

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  constructor(
    private _shareService: DataAccessClientsService,
    private _snackBarService: CnhSnackBarService,
    private _trowserService: CnhTrowserService,
    private _formBuilder: FormBuilder,
    private _dialog: MatDialog,
    @Inject(TROWSER_DATA) public data: any,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private readonly translate: TranslateService
  ) {
    this._trowserService.confirmExit(false);
    this._setButtonName();
  }

  checkStep() {
    return (
      (this.stepType === StepType.SPECIFIC &&
        this.selectedIndex === SpecificStepsName.CONFIRM) ||
      (this.stepType === StepType.ALL &&
        this.selectedIndex === AllStepsName.CONFIRM)
    );
  }
  hasAllOperation() {
    return (
      this.stepType === StepType.ALL &&
      this.anyoneSelect &&
      this.loadedFieldValue
    );
  }

  public ngOnInit() {
    this.brand = this.userService['_user'].brand;
    this.AlloperationData = this.selectedOperations;
    this.form = this._formBuilder.group({
      dataType: [Validators.required]
    });
    this.form.valueChanges.subscribe(value => {
      this.anyoneSelect = true;
      if (this.data.shareData && this.data.shareData.shareAll) {
        this.data.shareData = undefined;
      }
      this.dataTypeFormReceiver(value);
      this.selectedFields = [];
    });
    if (this.data.shareData) {
      this.anyoneSelect = true;
      if (!this.data.shareData.shareAll) {
        this.loadedFieldValue = false;
        this.dataTypeFormReceiver({ dataType: 1 });
      } else {
        this.dataTypeFormReceiver({ dataType: 0 });
      }
    }
  }
  removeItemFromField(field) {
    if (this.selectedFields.length === 1) {
      const modalData: IModalData = {
        confirmColor: CnhThemeColor.PRIMARY,
        confirmLabel: this.translate.instant('GLOBAL.OK'),
        contentText: this.translate.instant('DATA_ACCESS.REMOVE_FIELD'),
        iconName: 'warning-2',
        header: this.translate.instant('DATA_ACCESS.CANNOT_REMOVE_FIELD'),
        name: 'cnhDataAccess_confirmPartnerRemoval',
        hasCancel: false
      };

      this._dialog
        .open(CnhModalComponent, {
          data: modalData,
          width: '480px',
          autoFocus: false
        })
        .afterClosed()
        .subscribe(
          data => {
            if (data && data.response) {
            }
          },
          error => console.error(error)
        );
    } else {
      this._snackBarService.open(
        field.Name +
          ' ' +
          this.translate.instant('DATA_ACCESS.REMOVE_FILED_SUCCESS')
      );
      this._trowserService.changeFieldValue(field);
    }
  }

  public closeModal() {
    this._trowserService.destroyTrowser();
  }

  public goToStepNext() {
    if (!this.anyoneSelect) {
      this.makeSelection = true;
      return;
    }
    if (this.isButtonNextDisable()) {
      return;
    }
    if (
      this.stepType === StepType.ALL &&
      this.selectedIndex === AllStepsName.DATATYPE
    ) {
      document
        .getElementsByClassName('mat-stepper-horizontal-line')[0]
        .setAttribute('style', 'border-top: 2px solid #219d37');
      this._setButtonName();
      this._shareAll();
    } else if (
      this.stepType === StepType.ALL &&
      this.selectedIndex === AllStepsName.CONFIRM
    ) {
      this.selectedIndex = null;
      this._shareService.getDataAccess().subscribe();
      this.closeModal();
    } else if (
      this.stepType === StepType.SPECIFIC &&
      this.selectedIndex === SpecificStepsName.FIELDS
    ) {
      document
        .getElementsByClassName('mat-stepper-horizontal-line')[1]
        .setAttribute('style', 'border-top: 2px solid #219d37');
      this.selectedIndex = SpecificStepsName.OPERATIONS;
      this._setButtonName();
      // this._shareSelected();
    } else if (
      this.stepType === StepType.SPECIFIC &&
      this.selectedIndex === SpecificStepsName.OPERATIONS
    ) {
      // this._setButtonName();
      document
        .getElementsByClassName('mat-stepper-horizontal-line')[2]
        .setAttribute('style', 'border-top: 2px solid #219d37');
      this._shareSelected();
    } else if (
      this.stepType === StepType.SPECIFIC &&
      this.selectedIndex === SpecificStepsName.DATATYPE
    ) {
      document
        .getElementsByClassName('mat-stepper-horizontal-line')[0]
        .setAttribute('style', 'border-top: 2px solid #219d37');
      this.selectedIndex = SpecificStepsName.FIELDS;
      this._setButtonName();
    } else if (
      this.stepType === StepType.SPECIFIC &&
      this.selectedIndex === SpecificStepsName.CONFIRM
    ) {
      this.selectedIndex = null;
      this.closeModal();
    } else {
      this.selectedIndex = this.selectedIndex + 1;
      this._setButtonName();
    }
  }

  public goToStepBack() {
    this.selectedIndex =
      this.selectedIndex !== 0 ? this.selectedIndex - 1 : this.selectedIndex;
    this._setButtonName();
  }

  public showBackButton(): boolean {
    if (
      this.stepType === StepType.SPECIFIC &&
      (this.selectedIndex === SpecificStepsName.FIELDS ||
        this.selectedIndex === SpecificStepsName.OPERATIONS)
    ) {
      return true;
    }
  }

  public dataTypeFormReceiver(value) {
    this.stepType = value.dataType;
    this.makeSelection = false;
    if (this.stepType === StepType.SPECIFIC) {
      if (
        this.data.shareData &&
        !this.data.shareData.shareAll &&
        this.selectedFields.length === 0
      ) {
        this.loadedFieldValue = false;
      }
      this.selectedOperations = [];
      this.hasSetupData = false;
      this.allOrSelectedField = false;
    } else {
      this.loadedFieldValue = true;
      this.selectedOperations = this.AlloperationData;
      this.hasSetupData = true;
      this.allOrSelectedField = true;
    }
    this.cdr.detectChanges();
    this._setButtonName();
  }

  public handleFieldsSelection(fields) {
    if (fields.length > 0) {
      this.loadedFieldValue = true;
    }
    this.selectedFields = fields;
  }

  public handleOperationsSelection(operations) {
    if (this.stepType === StepType.SPECIFIC) {
      this.selectedOperations = operations;
    }
  }

  public handleMapOperationsSelection(value) {
    this.hasSetupData = value;
  }

  public isButtonNextDisable() {
    return (
      (this.stepType === StepType.SPECIFIC &&
        this.selectedIndex === SpecificStepsName.FIELDS &&
        !this.selectedFields.length) ||
      (this.selectedIndex === SpecificStepsName.OPERATIONS &&
        (!this.selectedOperations.length && !this.hasSetupData))
    );
  }

  private _setButtonName(): void {
    this._shareService.setStepValue(this.selectedIndex);
    if (
      this.stepType === StepType.SPECIFIC &&
      (this.selectedIndex === SpecificStepsName.FIELDS ||
        this.selectedIndex === SpecificStepsName.OPERATIONS ||
        this.selectedIndex === SpecificStepsName.DATATYPE)
    ) {
      this.buttonText = this.translate.instant('GLOBAL.NEXT');
    }
    if (
      this.stepType === StepType.SPECIFIC &&
      this.selectedIndex === SpecificStepsName.FIELDS
    ) {
      this.backButtonText = this.translate.instant(
        'DATA_ACCESS.FIELDS_BACK_BUTTON'
      );
    }
    if (
      this.stepType === StepType.SPECIFIC &&
      this.selectedIndex === SpecificStepsName.OPERATIONS &&
      this.stepType === StepType.SPECIFIC
    ) {
      this.backButtonText = this.translate.instant(
        'DATA_ACCESS.OPERATIONS_BACK_BUTTON'
      );
    }
    if (
      this.stepType === StepType.SPECIFIC &&
      this.selectedIndex === SpecificStepsName.CONFIRM
    ) {
      this.buttonText = this.translate.instant('GLOBAL.OK');
    }
    if (
      this.stepType === StepType.ALL &&
      this.selectedIndex === AllStepsName.CONFIRM
    ) {
      this.buttonText = this.translate.instant('GLOBAL.OK');
      this._shareService.setStepValue(3);
    }
    if (
      this.stepType === StepType.ALL &&
      this.selectedIndex === AllStepsName.DATATYPE
    ) {
      this.buttonText = this.translate.instant('GLOBAL.NEXT');
    }
  }

  private _shareAll() {
    if (this.data.partner) {
      this._shareService.shareAll(this.data.partner.rawId).subscribe(
        () => {
          this.translate
            .get('DATA_ACCESS.SUMMARY_SHARE_ALL.SUCCESS_TITLE', {
              company: this.data.partner.name || this.data.partner.email
            })
            .subscribe((res: string) => {
              (this.title = res),
                (this.values = [
                  this.translate.instant('DATA_ACCESS.SUMMARY_SHARE_ALL.VALUE')
                ]);
              this.notes = this.translate.instant(
                'DATA_ACCESS.SUMMARY_SHARE_ALL.SUCCESS_NOTES'
              );
              (this.info = this.translate.instant(
                'DATA_ACCESS.SUMMARY_SHARE_ALL.SUCCESS_INFO'
              )),
                (this.selectedIndex = AllStepsName.CONFIRM);
              this._setButtonName();
              this.stepper.next();
              this._shareService.getDataAccess().subscribe();
            });
          // this._snackBarService.open('DATA_ACCESS.DATA_GRANTED');
        },
        () => {
          // this._snackBarService.open('DATA_ACCESS.DATA_GRANTED_ERROR');
        }
      );
    } else {
      // this._snackBarService.open('DATA_ACCESS.DATA_GRANTED_ERROR');
    }
  }

  private _shareSelected() {
    if (this.data.partner) {
      this._shareService
        .shareSelected(
          this.data.partner.rawId,
          this.selectedFields,
          this.selectedOperations,
          this.hasSetupData
        )
        .subscribe(
          () => {
            let titleNameSELECTED;
            let selectedFiledValue;
            this.translate
              .get('DATA_ACCESS.SUMMARY_SHARE_SPECIFIC.SUCCESS_TITLE', {
                company: this.data.partner.name || this.data.partner.email
              })
              .subscribe((res: string) => {
                titleNameSELECTED = res;
              });
            this.translate
              .get('DATA_ACCESS.SUMMARY_SHARE_SPECIFIC.VALUE', {
                fieldsCount: this.selectedFields.length
              })
              .subscribe((res: string) => {
                selectedFiledValue = res;
              });
            (this.title = titleNameSELECTED),
              (this.values = [selectedFiledValue]);
            this.notes = this.translate.instant(
              'DATA_ACCESS.SUMMARY_SHARE_ALL.SUCCESS_NOTES'
            );
            this.info = this.translate.instant(
              'DATA_ACCESS.SUMMARY_SHARE_SPECIFIC.SUCCESS_INFO'
            );
            this.selectedIndex = SpecificStepsName.CONFIRM;
            this._setButtonName();
            this.stepper.next();
            this._shareService.getDataAccess().subscribe();
            // this._snackBarService.open('DATA_ACCESS.DATA_GRANTED');
          },
          () => {
            // this._snackBarService.open('DATA_ACCESS.DATA_GRANTED_ERROR');
          }
        );
    } else {
      // this._snackBarService.open('DATA_ACCESS.DATA_GRANTED_ERROR');
    }
  }
}
