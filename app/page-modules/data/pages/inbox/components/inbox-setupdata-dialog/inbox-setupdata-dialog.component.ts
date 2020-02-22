import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource } from '@angular/material';

import { ApiService } from '@services/api/api.service';
// import { inboxFieldDatePostService } from '../../services/farm-field-data-post.service';
// import { FarmOperationSetupDataService } from '../../services/farm-operation-setup-data.service';
import { UserService } from '@services/user/user.service';

import { BrandNames, BrandColors } from '@enums/brand.enum';
import { TranslateService } from '@ngx-translate/core';
import { DataFileService } from '../../services/data-file.service';
@Component({
  selector: 'app-inbox-setupdata-dialog',
  templateUrl: './inbox-setupdata-dialog.component.html',
  styleUrls: ['./inbox-setupdata-dialog.component.css']
})
export class InboxSetupdataDialogComponent implements OnInit {
  displayedColumns = ['vehicleName', 'brandModel', 'pin'];
  dataSource: any;
  vNames: any[] = [];
  nextPage: boolean = false;
  lastItem: boolean = false;
  lastVehicle: boolean = false;
  inboxFieldDate: any = {};
  buttonText: string = 'CONFIRM';
  filterValue: string;
  isLoading: boolean;
  isSortingAsc: boolean = false;
  public checkedCount = 0;
  sendingItems: string;
  infoDetails: {};

  constructor(
    private api: ApiService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dataFileService: DataFileService,
    private dialogRef: MatDialogRef<InboxSetupdataDialogComponent>,
    // private farmOperationSetupDataService: FarmOperationSetupDataService,
    private readonly translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
  }

  ngOnInit() {
    this.translate.use(this.userService.getUserPreferredLang());
    this.buttonText = this.translate.instant('GLOBAL.CONFIRM');
    this.isLoading = true;
    this.api.getVehicleData().subscribe((data: any[]) => {
      this.isLoading = false;
      this.vNames = data.map(vehicle => ({
        id: vehicle.id,
        name: vehicle.name,
        brand: vehicle.brand,
        model: vehicle.model,
        checked: false
      }));
      this.isSortingAsc = true;
      this.changeSorting();
      this.dataSource = new MatTableDataSource(this.vNames);
    });
  }
  changeSorting() {
    this.isSortingAsc = !this.isSortingAsc;
    if (this.isSortingAsc) {
      this.vNames = this.vNames.sort((a, b) => b.name.localeCompare(a.name));
    } else {
      this.vNames = this.vNames.sort((a, b) => a.name.localeCompare(b.name));
    }

    this.dataSource = new MatTableDataSource(this.vNames);
    this.dataSource.filter = this.filterValue;
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();

    this.dataSource.filter = filterValue;
    this.filterValue = filterValue;
  }

  onChange(val, event) {
    for (let i = 0; i < this.vNames.length; i++) {
      if (val.id === this.vNames[i].id) {
        this.vNames[i].checked = !this.vNames[i].checked;

        break;
      }
    }

    this.checkedCount = this.checkedItems().length;
    this.translateCheckedCount();
  }

  checkedItems() {
    return this.vNames.filter(f => f.checked);
  }

  removeVehicle(id, option) {
    if (option === 'SELECT') {
      this.updateCheckedValue(id, false);
    } else {
      if (this.checkedCount === 1) {
        this.lastVehicle = true;
      } else {
        this.updateCheckedValue(id, false);
      }
    }

    this.checkedCount = this.checkedItems().length;
    this.translateCheckedCount();
  }

  private updateCheckedValue(id, value) {
    for (let i = 0; i < this.vNames.length; i++) {
      const element = this.vNames[i];

      if (element.id === id) {
        element.checked = value;

        break;
      }
    }
  }

  removeSetup(index) {
    if (this.data.length === 1) {
      this.lastItem = true;
    } else {
      this.data.splice(index, 1);
    }
  }

  clearAll() {
    this.vNames.forEach(f => (f.checked = false));
    this.checkedCount = this.checkedItems().length;
    this.translateCheckedCount();
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

  pageChange(buttonTxt) {
    this.nextPage = true;

    if (buttonTxt === this.translate.instant('GLOBAL.CONFIRM')) {
      this.buttonText = this.translate.instant('GLOBAL.SEND');
    } else if (buttonTxt === this.translate.instant('GLOBAL.SEND')) {
      this.postSendFileTransfer();
    }
  }

  postSendFileTransfer() {
    const itemIds = [];
    const vehicleIds = [];

    this.data.forEach(element => {
      itemIds.push({ FileUrl: element.FileUrl, FileName: element.FileName });
    });

    this.checkedItems().forEach(element => {
      vehicleIds.push(element.id);
    });

    this.inboxFieldDate['Files'] = itemIds;
    this.inboxFieldDate['VehicleIds'] = vehicleIds;
    this.dialogRef.close();
    this._dataFileService.postSendFileTransfer(this.inboxFieldDate).subscribe(res => {});
  }

  setPageState() {
    this.nextPage = false;
    this.buttonText = this.translate.instant('GLOBAL.CONFIRM');
    this.lastItem = false;
    this.lastVehicle = false;
  }
  translateCheckedCount() {
    this.translate
      .get('SEND_DATA.SENDING_ITEMS', { vehicles: this.checkedCount })
      .subscribe((res: string) => {
        this.sendingItems = res;
      });
  }
}
