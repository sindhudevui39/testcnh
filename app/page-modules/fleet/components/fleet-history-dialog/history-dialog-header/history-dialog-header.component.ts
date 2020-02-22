import { Component, OnInit } from '@angular/core';
import { FleetService } from '@fleet/services/fleet.service';

@Component({
  selector: 'app-history-dialog-header',
  templateUrl: './history-dialog-header.component.html',
  styleUrls: ['./history-dialog-header.component.css']
})
export class HistoryDialogHeaderComponent implements OnInit {
  selectedTitle = 'hours';
  prevSelectedTitle = 'hours';
  isDesc = true;
  isAsc = false;
  constructor(private fleetService: FleetService) {}

  ngOnInit() {}
  onTitleClick(id) {
    this.selectedTitle = id;

    if (id === this.prevSelectedTitle && !this.isDesc) {
      this.isAsc = false;
      this.isDesc = true;
      this.fleetService.sortBy(id, true);
      this.fleetService.setHistorySortOrder(true);
    } else {
      this.isAsc = true;
      this.isDesc = false;
      this.fleetService.sortBy(id, false);
      this.fleetService.setHistorySortOrder(false);
    }
    this.fleetService.setHistorySortAttr(id);

    this.prevSelectedTitle = id;
  }
}
