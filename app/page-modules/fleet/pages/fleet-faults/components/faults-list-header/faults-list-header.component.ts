import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FleetService } from '@fleet/services/fleet.service';

@Component({
  selector: 'app-faults-list-header',
  templateUrl: './faults-list-header.component.html',
  styleUrls: ['./faults-list-header.component.css']
})
export class FaultsListHeaderComponent implements OnInit {
  titlesList: Array<{ title: string; id: string }>;
  selectedTitle = 'date';
  prevSelectedTitle = 'date';
  isDesc = true;
  isAsc = false;
  constructor(private translateService: TranslateService, private fleetService: FleetService) {}

  ngOnInit() {
    this.translateService
      .get([
        'PAGE_FAULTS.NAME',
        'PAGE_FAULTS.FILTER.STATUS',
        'PAGE_FAULTS.SEVERITY',
        'PAGE_FAULTS.ID',
        'PAGE_FAULTS.SOURCE',
        'GLOBAL.DATE'
      ])
      .subscribe(response => {
        this.titlesList = [];

        this.titlesList.push({ title: response['PAGE_FAULTS.FILTER.STATUS'], id: 'status' });
        this.titlesList.push({ title: response['PAGE_FAULTS.SEVERITY'], id: 'severity' });
        this.titlesList.push({ title: response['PAGE_FAULTS.ID'], id: 'fault-id' });
        this.titlesList.push({ title: response['PAGE_FAULTS.SOURCE'], id: 'source' });
        this.titlesList.push({ title: response['GLOBAL.DATE'], id: 'date' });
      });
  }

  onTitleCLick(id) {
    this.selectedTitle = id;

    if (id === this.prevSelectedTitle && !this.isDesc) {
      this.isAsc = false;
      this.isDesc = true;
      this.fleetService.sortBy(id, true);
      this.fleetService.selectedOrder = true;
    } else {
      this.isAsc = true;
      this.isDesc = false;
      this.fleetService.sortBy(id, false);
      this.fleetService.selectedOrder = false;
    }
    this.fleetService.selectedAttr = id;

    this.prevSelectedTitle = id;
  }
}
