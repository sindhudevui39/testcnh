import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetFirmwareSelectionComponent } from './fleet-firmware-selection.component';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule, MatRadioModule } from '@angular/material';
import { SearchComponent } from '@shared-components/search/search.component';
import { LoaderComponent } from '@shared-modules/loading/loader.component';
import { SearchHighlightPipe } from '@fleet/pipes/search-highlight.pipe';
import { WordWrapTooltipDirective } from '@shared-directives/word-wrap-tooltip/word-wrap-tooltip.directive';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';
import { UserService } from '@services/user/user.service';
import { FOTAApiService } from '../../services/fota-api.service';
import { FotaService } from '../../services/fota/fota.service';
import { UtilService } from '@services/util/util.service';
import { user } from 'src/app/test-constants/User';
import { of } from 'rxjs';

describe('FleetFirmwareSelectionComponent', () => {
  let userService: UserService;
  let fotaApiService: FOTAApiService;
  let utilService: UtilService;
  let fotaService: FotaService;

  const campaignList = [
    {
      active: true,
      downloadedVehicles: 0,
      id: '328080399727803100',
      installedVehicles: 0,
      link: 'https://mock.com/dealerportal/CNH/Precision/ESTReleaseNotesSummary',
      name: 'AlexDebugCampaign02',
      notifiedVehicles: 0,
      releaseDate: '2019-06-06T19:23:15.796+0000',
      totalVehicles: 1
    },
    {
      active: true,
      downloadedVehicles: 0,
      id: '43319743913490569',
      installedVehicles: 0,
      link: 'https://mock.com/dealerportal/CNH/Precision/ESTReleaseNotesSummary',
      name: 'fotademocampaign002',
      notifiedVehicles: 0,
      releaseDate: '2019-02-21T23:44:01.097+0000',
      totalVehicles: 1
    }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        FormsModule,
        TranslateModule.forRoot(),
        PerfectScrollbarModule,
        MatDialogModule,
        MatRadioModule
      ],
      declarations: [
        FleetFirmwareSelectionComponent,
        SearchComponent,
        WordWrapTooltipDirective,
        SearchHighlightPipe,
        LoaderComponent
      ],
      providers: [
        UserService,
        FOTAApiService,
        UtilService,
        FotaService,
        {
          provide: 'window',
          useValue: window
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    userService = TestBed.get(UserService);
    userService.user = user;

    fotaApiService = TestBed.get(FOTAApiService);
    utilService = TestBed.get(UtilService);
    fotaService = TestBed.get(FotaService);
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FleetFirmwareSelectionComponent);
    const component = fixture.debugElement.componentInstance;

    expect(component).toBeTruthy();
  });

  it(`should have campaigns from FotaApiService'`, async(() => {
    const fixture = TestBed.createComponent(FleetFirmwareSelectionComponent);
    const component = fixture.debugElement.componentInstance;
    spyOn(fotaApiService, 'fetchCampaignsList').and.returnValue(
      fotaApiService._campaignList$.next(campaignList)
    );

    fotaApiService.campaignList$.subscribe(res => {
      fixture.detectChanges();
      component.campaignList = res;
      expect(component.campaignList).toEqual(campaignList);
      expect(component.firmwareCount).toEqual(2);
    });
  }));

  it(`should be empty if campaigns from FotaApiService returns []'`, async(() => {
    const fixture = TestBed.createComponent(FleetFirmwareSelectionComponent);
    const component = fixture.debugElement.componentInstance;
    const emptyCampaignList = [];
    spyOn(fotaApiService, 'fetchCampaignsList').and.returnValue(
      fotaApiService._campaignList$.next(emptyCampaignList)
    );

    fotaApiService.campaignList$.subscribe(res => {
      fixture.detectChanges();
      component.campaignList = res;
      expect(component.campaignList).toEqual(emptyCampaignList);
      expect(component.firmwareCount).toEqual(0);
    });
  }));
});
