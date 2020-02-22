import { TestBed, inject } from '@angular/core/testing';

import { FOTAApiService } from './fota-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from '@services/user/user.service';
import { user } from 'src/app/test-constants/User';
import { of, Observable } from 'rxjs';
import { testRoutes } from 'src/app/test-constants/test-routes';

describe('FOTAApiService', () => {
  let httpMock: HttpTestingController;
  let userService: UserService;

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FOTAApiService, UserService]
    });
    userService = TestBed.get(UserService);
    userService.user = user;
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', inject([FOTAApiService], (service: FOTAApiService) => {
    expect(service).toBeTruthy();
  }));

  it('should return a collection of campaignsList', inject(
    [FOTAApiService],
    (service: FOTAApiService) => {
      spyOn(service, 'fetchCampaignsList').and.returnValue(
        service._campaignList$.next(campaignList)
      );

      service.campaignList$.subscribe(res => {
        expect(res).toBe(campaignList);
      });
    }
  ));

  it('campaign API(api/fleet/get/GetFOTACampaigns) should return empty if dealer does not have any campaigns available', inject(
    [FOTAApiService],
    (service: FOTAApiService) => {
      const emptyCampaignList = [];
      spyOn(service, 'fetchCampaignsList').and.returnValue(
        service._campaignList$.next(emptyCampaignList)
      );

      service.campaignList$.subscribe(res => {
        expect(res).toBe(emptyCampaignList);
      });
    }
  ));

  it('should return value by campaignId', inject([FOTAApiService], (service: FOTAApiService) => {
    spyOn(service, 'campaignById').and.returnValue(of(campaignList[2]));

    let response;
    service.campaignById('43319743913490569').subscribe(res => {
      response = res['vehicles'];
      expect(response).toEqual(campaignList[2]);
    });
  }));
});
