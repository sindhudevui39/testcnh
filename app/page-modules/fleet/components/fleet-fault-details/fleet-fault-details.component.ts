import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialogRef, MatDialog } from '@angular/material';

import { FleetHistoryDialogComponent } from '../fleet-history-dialog/fleet-history-dialog.component';
import { FleetService } from '../../services/fleet.service';
import { ToolbarToggleFilterbarService } from '@fleet/services/events/toolbar-toggle-filterbar.service';
import { UserService } from '@services/user/user.service';
import { UtilService } from '@services/util/util.service';

import { BrandNames } from '@enums/brand.enum';

@Component({
  selector: 'app-fleet-fault-details',
  templateUrl: './fleet-fault-details.component.html',
  styleUrls: ['./fleet-fault-details.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class FleetFaultDetailsComponent implements OnInit {
  public brands = BrandNames;
  @Input()
  collapse;
  @Input()
  dataSource;
  historyDialogRef: MatDialogRef<FleetHistoryDialogComponent>;
  filtersBarOpen;
  currentDate;
  dateFormat: string;
  tzOffset: string;
  constructor(
    private _fleetService: FleetService,
    private _historyDialog: MatDialog,
    private _toggleFilterBarService: ToolbarToggleFilterbarService,
    public userService: UserService,
    private _utilService: UtilService
  ) {
    _toggleFilterBarService.openFiltersBar$.subscribe(value => {
      this.filtersBarOpen = value;
    });
  }

  ngOnInit() {
    this.tzOffset = this._utilService.getTimezoneOffset();
    this.dateFormat = this._utilService.getUserPreferredDateTimeFormatted();
    this.currentDate = new Date();
  }

  showHistoryModal(id, code, message, name) {
    this.historyDialogRef = this._historyDialog.open(FleetHistoryDialogComponent, {
      panelClass: 'custom-dialog-container',
      disableClose: true
    });
    this._fleetService._vId.next(id);
    this._fleetService._fCode.next(code);
    this._fleetService._fTitle.next(message);
    this._fleetService._vName.next(name);
  }
}
