import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { FleetHistoryService } from './services/fleet-history.service';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-fleet-history',
  templateUrl: './fleet-history.component.html',
  styleUrls: ['./fleet-history.component.css'],
  animations: [
    trigger('hideNotification', [
      state(
        'collapsed',
        style({
          height: '0',
          minHeight: '0',
          display: 'none',
          overflow: 'hidden'
        })
      ),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('350ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class FleetHistoryComponent implements OnInit {
  histories = {};
  isCollapsed = [];
  sortedDate;
  dataLoaded = false;
  orderedKeys;
  isDataEmpty = false;

  constructor(
    private route: ActivatedRoute,
    public userService: UserService,
    private fleetHistoryService: FleetHistoryService
  ) {}

  ngOnInit() {
    this.fleetHistoryService.getHistoryData().subscribe(data => {
      if (!this.isResponseEmpty(data)) {
        this.histories = data;
        this.orderedKeys = this.fleetHistoryService.orderedKeys;
        this.isDataEmpty = false;
      } else {
        this.isDataEmpty = true;
      }
      this.dataLoaded = true;
    });
  }

  private isResponseEmpty(data) {
    let empty = true;

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        empty = false;
        break;
      }
    }

    return empty;
  }
}
