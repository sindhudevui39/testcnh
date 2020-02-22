import { Component, OnInit } from '@angular/core';

import { FleetService } from '../../services/fleet.service';
import { FaultsFilterDataService } from '@fleet/services/fleet-faults-filter-data/faults-filter-data.service';
import { ApiService } from '@services/api/api.service';
import { UtilService } from '@services/util/util.service';
import { UserService } from '@services/user/user.service';

import { BrandNames } from '@enums/brand.enum';

@Component({
  selector: 'app-fleet-history-dialog',
  templateUrl: './fleet-history-dialog.component.html',
  styleUrls: ['./fleet-history-dialog.component.css']
})
export class FleetHistoryDialogComponent implements OnInit {
  public brands = BrandNames;
  historyData;
  showLoader = true;
  vId;
  fCode;
  fName;
  vName;
  // arrows
  disableLeftArrow = false;
  disableRightArrow = false;
  // page info
  page = 0;
  totalElements = 0;
  eleStartCount: number;
  eleEndCount: number;
  paginationOpts: any;
  tzOffset: string;
  dateTimeFormat: string;
  constructor(
    private _fleetService: FleetService,
    private _apiService: ApiService,
    private _utilService: UtilService,
    public userService: UserService,
    private _faultsFilterDataService: FaultsFilterDataService
  ) {}

  ngOnInit() {
    this._fleetService.vId$.subscribe(id => {
      this.vId = id;
    });

    this._fleetService.fCode$.subscribe(id => {
      this.fCode = id;
    });

    this._fleetService.fTitle$.subscribe(id => {
      this.fName = id;
    });

    this._fleetService.vName$.subscribe(id => {
      this.vName = id;
    });

    this.tzOffset = this._utilService.getTimezoneOffset();
    this.dateTimeFormat = `${this._utilService.getUserPreferredDateTimeFormatted()}, hh:mm a`;

    this._fleetService.setHistorySortAttr('hours');
    this._fleetService.setHistorySortOrder(true);

    this.displayFaultHistory(this.vId, this.fCode, this.page);
  }

  displayFaultHistory(id, code, page) {
    const date = this._faultsFilterDataService.getDateForSelectedDays();

    this._apiService.getFaultHistory(date, id, code, page).subscribe(historyData => {
      this.historyData = this._fleetService.setupFaultsHistoryData(historyData);

      this.eleStartCount = historyData['page']['number'] * 10 + 1;
      this.eleEndCount = this.eleStartCount + historyData['content'].length - 1;

      if (historyData['page']['number'] === historyData['page']['totalPages'] - 1) {
        this.disableRightArrow = true;
        this.eleEndCount = historyData['page']['totalElements'];
      }
      if (historyData['page']['number'] === 0) {
        this.disableLeftArrow = true;
        this.eleStartCount = 1;
      }

      this.totalElements = historyData['page']['totalElements'];

      this.page = historyData['page']['number'];

      this.paginationOpts = {
        lowerElement: this.eleStartCount,
        higherElement: this.eleEndCount,
        totalElements: this.totalElements
      };

      this.showLoader = false;
    });
  }

  onLeftArrowClick() {
    this.showLoader = true;

    this.disableRightArrow = false;

    this.page = this.page - 1;

    this.displayFaultHistory(this.vId, this.fCode, this.page);
  }

  onRightArrowClick() {
    this.showLoader = true;

    this.disableLeftArrow = false;

    this.page = this.page + 1;

    this.displayFaultHistory(this.vId, this.fCode, this.page);
  }
}
