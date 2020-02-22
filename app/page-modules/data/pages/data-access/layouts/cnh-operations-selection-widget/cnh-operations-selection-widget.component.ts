import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  OnDestroy,
  Inject
} from '@angular/core';
import { Set as ImmSet } from 'immutable';
import { Observable, Subject, Subscription } from 'rxjs';
import { TROWSER_DATA } from '../../services/data-access-setup-service';
import * as _ from 'underscore';

interface IOperationStyles {
  iconField: string;
  iconSimple: string;
  iconSimpleLighter: string;
  color: string;
}

export interface IOperationObj {
  name: string;
  styles: IOperationStyles;
  label: string;
}

export enum OperationsDataEnum {
  PLANTING = 'PLANTING',
  SEEDING = 'SEEDING',
  SPRAYING = 'SPRAYING',
  SPREADING = 'SPREADING',
  HARVESTING = 'HARVESTING'
  // SWATHING = 'SWATHING',
  // TILLAGE = 'TILLAGE',
}
@Component({
  selector: 'cnh-operations-selection-widget',
  templateUrl: './cnh-operations-selection-widget.component.html',
  styleUrls: ['./cnh-operations-selection-widget.component.css']
})
export class CnhOperationsSelectionWidgetComponent
  implements OnInit, OnDestroy {
  @Output()
  public selectedOperations: EventEmitter<IOperationObj[]>;
  @Output()
  public selectedSetupData: EventEmitter<boolean>;
  protected subscriptions: Set<Subscription> = new Set();
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  public operations: IOperationObj[];
  public loading$: Observable<boolean>;
  public checkedOperations: ImmSet<IOperationObj>;
  public checkedMapOperations: boolean;
  public checkedAll: boolean;
  public indeterminateAll: boolean;
  public operationImgBaseUrl = './assets/images/';

  public operationStyles: Map<string, any> = new Map([
    [
      'PLANTING',
      {
        iconField: 'planting.svg',
        iconSimple: 'planting.svg',
        iconSimpleLighter: 'planting_lighter.svg',
        color: '#239546'
      }
    ],
    [
      'SEEDING',
      {
        iconField: 'planting.svg',
        iconSimple: 'planting.svg',
        iconSimpleLighter: 'planting_lighter.svg',
        color: '#239546'
      }
    ],
    [
      'HARVESTING',
      {
        iconField: 'harvesting.svg',
        iconSimple: 'harvesting.svg',
        iconSimpleLighter: 'harvesting_lighter.svg',
        color: '#d5a740'
      }
    ],
    [
      'SPREADING',
      {
        iconField: 'spreading.svg',
        iconSimple: 'spreading.svg',
        iconSimpleLighter: 'spreading_lighter.svg',
        color: '#7858ba'
      }
    ],
    [
      'SPRAYING',
      {
        iconField: 'spraying.svg',
        iconSimple: 'spraying.svg',
        iconSimpleLighter: 'spraying_lighter.svg',
        color: '#439de6'
      }
    ]
    // ['TILLAGE',
    //   {iconField: 'tillage.svg',
    //     iconSimple: 'tillage.svg',
    //     iconSimpleLighter: 'tillage_lighter.svg',
    //     color: '#705339'}],
    // ['SWATHING',
    //   {iconField: 'swathing.svg',
    //     iconSimple: 'swathing.svg',
    //     iconSimpleLighter: 'swathing_lighter.svg',
    //     color: '#da762c'}]
  ]);

  public operationNames: Map<string, string> = new Map([
    ['PLANTING', 'Planting'],
    ['SEEDING', 'Seeding'],
    ['SPRAYING', 'Spraying'],
    ['SPREADING', 'Spreading'],
    ['HARVESTING', 'Harvesting']
    // ['SWATHING', 'Swathing'],
    // ['TILLAGE', 'Tillage'],
  ]);

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public constructor(@Inject(TROWSER_DATA) public data: any) {
    this.operations = [];
    this.checkedOperations = ImmSet<IOperationObj>();
    this.checkedMapOperations = false;
    this.checkedAll = false;
    this.indeterminateAll = false;

    this.selectedOperations = new EventEmitter<IOperationObj[]>();
    this.selectedSetupData = new EventEmitter<boolean>();
  }

  public ngOnInit() {
    this.operationImgBaseUrl = './assets/images/';
    this.operations = [];
    this.checkedOperations = ImmSet<IOperationObj>();
    this.checkedMapOperations = false;
    this.checkedAll = false;
    this.indeterminateAll = false;
    const operationName: string[] = Object.values(OperationsDataEnum);
    const operationsObjArray: IOperationObj[] = [];
    operationName.map(name => {
      const capitalizedName = name.toUpperCase();
      const operationObj: IOperationObj = {
        name: capitalizedName,
        styles: this.operationStyles.get(capitalizedName),
        label: this.operationNames.get(capitalizedName)
      };
      operationsObjArray.push(operationObj);
    });
    this.operations = operationsObjArray;
    if (this.data.shareData && this.data.shareData.operations.length >= 0) {
      if (this.data.shareData.shareFieldObjects) {
        this.onToggleMapOperation();
      }
      for (let i = 0; i < this.data.shareData.operations.length; i++) {
        if (
          _.where(this.operations, { name: this.data.shareData.operations[i] })
            .length > 0
        ) {
          this.onToggleOperation(
            _.where(this.operations, {
              name: this.data.shareData.operations[i]
            })[0]
          );
        }
      }
    }
  }

  public async onToggleOperation(operation: IOperationObj): Promise<void> {
    if (!!operation) {
      const wasChecked = this.checkedOperations.has(operation);
      if (wasChecked) {
        this.checkedOperations = this.checkedOperations.remove(operation);
      } else {
        this.checkedOperations = this.checkedOperations.add(operation);
      }
      this.updateIndeterminateAll();
      this.updateCheckedAll();
      this.selectedOperations.emit(this.checkedOperations.toArray());
    }
  }

  public async onToggleMapOperation(): Promise<void> {
    this.checkedMapOperations = !this.checkedMapOperations;
    this.selectedSetupData.emit(this.checkedMapOperations);
  }

  public onToggleAll(): void {
    if (this.indeterminateAll || !this.checkedAll) {
      this.checkedAll = true;
      this.indeterminateAll = false;
      this.checkedOperations = this.checkedOperations.union(this.operations);
    } else {
      this.checkedAll = false;
      this.indeterminateAll = false;
      this.checkedOperations = this.checkedOperations.clear();
    }
    this.selectedOperations.emit(this.checkedOperations.toArray());
  }

  public trackByFn(index: number, operation: IOperationObj) {
    return (!!operation && operation.name) || index;
  }

  private updateCheckedAll(): void {
    this.checkedAll = this.checkedOperations.size === this.operations.length;
  }

  private updateIndeterminateAll(): void {
    const checkedCount = this.checkedOperations.size;
    this.indeterminateAll =
      checkedCount !== 0 && checkedCount !== this.operations.length;
  }
}
