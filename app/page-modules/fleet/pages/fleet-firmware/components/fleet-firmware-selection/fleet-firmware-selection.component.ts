import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { FOTAApiService } from '../../services/fota-api.service';
import { UserService } from '@services/user/user.service';
import { UtilService } from '@services/util/util.service';
import { FotaService } from '../../services/fota/fota.service';

@Component({
  selector: 'app-fleet-firmware-selection',
  templateUrl: './fleet-firmware-selection.component.html',
  styleUrls: ['./fleet-firmware-selection.component.css']
})
export class FleetFirmwareSelectionComponent implements OnInit {
  @Output()
  public selectedCampaign = new EventEmitter<any>();
  campaignId: string;
  campaignList: any;
  firmwareCount = 0;
  dataLoaded = false;
  isDesc = true;
  isDataEmpty = true;
  searchStringSoftware: string;
  tzOffset: string;
  selectedRow: number;

  constructor(
    public userService: UserService,
    private fotaApiService: FOTAApiService,
    private utilService: UtilService,
    private fotaService: FotaService
  ) {}

  ngOnInit() {
    this.dataLoaded = false;
    this.tzOffset = this.utilService.getTimezoneOffset();
    this.isDesc = this.fotaService.isCampaignDesc;

    this.fotaApiService.campaignList$.subscribe(data => {
      if (data) {
        this.dataLoaded = true;
        if (data.length > 0) {
          this.campaignList = data;
          this.firmwareCount = data.length;

          this.sortCampaign();

          if (this.fotaService.selectedCampaign) {
            this.campaignId = this.fotaService.selectedCampaign.id;
          }

          this.isDataEmpty = false;
        } else {
          this.isDataEmpty = true;
        }
      }
    });

    this.fotaApiService.fetchCampaignsList();
  }

  sortCampaign() {
    if (this.isDesc) {
      this.campaignList.sort((a, b) =>
        this.fotaApiService.sortByDate(a.releaseDate, b.releaseDate)
      );
    } else {
      this.campaignList.sort((b, a) =>
        this.fotaApiService.sortByDate(a.releaseDate, b.releaseDate)
      );
    }

    this.fotaService.isCampaignDesc = this.isDesc;
  }

  onFirmwareSelection(campaign) {
    this.campaignId = campaign.id;
    this.fotaService.selectedCampaign = campaign;
    this.selectedCampaign.emit({ id: campaign['id'], name: campaign['name'] });
  }

  searchFirmware(event) {
    const searchString = event.searchString;

    if (searchString) {
      this.searchStringSoftware = searchString.toLowerCase();
    } else {
      this.searchStringSoftware = searchString;
    }

    this.fotaApiService.searchBySoftware(event);
  }
}
