import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { UserService } from '@services/user/user.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map, shareReplay, retry, catchError } from 'rxjs/operators';
import { FleetVehicle } from '@models/fleet-vehicle';
import { FleetCompanyUser } from '@models/fleet-company-user';
import { FleetUrls } from '@fleet/services/fleet-api/fleet-urls.enum';
import { FleetUtilService } from '@fleet/services/fleet-util/fleet-util.service';

const FLEET_DEFAULT_SELECTION = 'all_fleets';
const MODEL_DEFAULT_SELECTION = 'all_models';
const COMPANY_DEFAULT_SELECTION = 'all_companies';
const ROLE_DEFAULT_SELECTION = 'all_roles';

interface CustomRule {
  code: string;
  condition: string;
  durationMs: number;
  threshold: number;
}

export interface UserData {
  userId: string;
  email: string;
  phone?: string;
  tzOffset: number;
  channel: Array<string>;
}

@Injectable({
  providedIn: 'root'
})
export class FleetPostNotificationService {
  // WARNING!!!!!!!
  // DO NOT MODIFY THE _vehicleList
  // IT HOLD THE INITIAL REFERENCE FOR THE DATA
  // FROM THE UNITS API
  private _vehicleList: any;

  private _userList: any;

  userEmail: string;
  companyId: string;
  public vehicleList$ = new BehaviorSubject<any>(null);
  private _notificationName = '';
  private _customRule: CustomRule;
  private _vehicleCount: number;
  private _userData: Array<UserData>;
  public userList$ = new BehaviorSubject<any>(null);
  public notificationName$ = new BehaviorSubject<any>(null);
  public customRule$ = new BehaviorSubject<any>(null);
  public userCount$ = new BehaviorSubject<any>(null);
  private faultNotificationList = [];
  _customNotificationData = {};

  public translatedWords = {
    fleet: '',
    all: '',
    allModels: '',
    vehicleParameter: '',
    allCompanies: '',
    allRoles: '',
    vehicles: ''
  };
  public translatedForNotificationHistroy = {
    VEHICLE_OVERVIEW: '',
    CUSTOM_NOTIFICATION: '',
    NO_ALERTS: '',
    NO_CUSTOM: '',
    HIGH_FAULTS: '',
    NOTIFICATIONS: '',
    TODAY: '',
    YESTERDAY: '',
    CUSTOM: '',
    ALERTS: ''
  };

  fleetDropdownTitle: string;
  modelDropdownTitle: string;

  defaultFleetTitle: string;
  defaultModelTitle: string;

  companyDropdownTitle: string;
  roleDropdownTitle: string;

  defaultCompanyTitle: string;
  defaultRoleTitle: string;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private fleetUtilService: FleetUtilService
  ) {
    this.userEmail = userService['_user'].email;
    this.companyId = this.userService.getUser().companyId;
  }

  public get notificationName(): string {
    return this._notificationName;
  }

  public set notificationName(value: string) {
    this._notificationName = value;
  }
  public get customRule(): CustomRule {
    return this._customRule;
  }

  public set customRule(value: CustomRule) {
    this._customRule = { ...value };
  }

  public get customNotificationData(): any {
    return this._customNotificationData;
  }

  public set customNotificationData(value: any) {
    this._customNotificationData = { ...value };
  }

  public get vehicleCount(): number {
    return this._vehicleCount;
  }

  public set vehicleCount(value: number) {
    this._vehicleCount = value;
  }

  public get userData(): Array<UserData> {
    return this._userData;
  }

  public set userData(value: Array<UserData>) {
    this._userData = [...value];
  }
  public getIntialVehicleData() {
    return this._vehicleList;
  }

  public vehicleList() {
    if (!this.vehicleList$.getValue()) {
      this.http
        .get(FleetUrls.VEHICLE_DATA)
        .pipe(
          map(data => {
            return this.getVehicles(data['content']);
          })
        )
        .subscribe(
          data => {
            this._vehicleList = { ...data };
            this.vehicleList$.next(this._vehicleList);
          },
          error => {
            catchError(error);
            console.log(error);
          }
        );
    }
  }

  getUserListSelectedNotification(groupId) {
    return this.http.get(`${FleetUrls.GETUSERS}` + '/' + groupId).pipe(
      map(data => {
        if (data && data['users']) {
          return data['users'];
        }
        return [];
      }),
      shareReplay(1)
    );
  }
  public userList(): void {
    this.http
      .get(`${FleetUrls.FLEET_COMPANY_USERS}?companyId=${this.companyId}`)
      .pipe(
        retry(5),
        map(data => this.getCompanyUsers(data))
      )
      .subscribe(
        data => {
          this._userList = { ...data };

          this.userList$.next(this._userList);
        },
        error => {
          this._userList = {};
          this.userList$.next(this._userList);
          console.log(error);
        }
      );
  }

  getVehicles(data) {
    const vehicles = {};
    if (data) {
      Array.from(new Set(data.sort((b, a) => this.sortByName(a.name, b.name))));
      data.forEach(item => {
        const vehicle: FleetVehicle = {
          id: item.id,
          name: item.name,
          model: item.model,
          fleet: item.fleets,
          isClimateVehicle: this.fleetUtilService.isDeviceTypeCFV(item.capabilities)
        };
        const key = item.fleets[0].name;

        if (!(key in vehicles)) {
          vehicles[key] = [];
        }
        if (!this.fleetUtilService.isDeviceTypeCFV(item.capabilities)) {
          vehicles[key].push(vehicle);
        }
      });
      return vehicles;
    } else {
      return {};
    }
  }

  sortByName(a, b): number {
    a = a.toLowerCase();
    b = b.toLowerCase();
    return a > b ? -1 : b > a ? 1 : 0;
  }

  getCompanyUsers(data) {
    const users = {};
    if (data) {
      Array.from(new Set(data.sort((b, a) => this.sortByName(a.fullName, b.fullName))));
      data.sort().forEach(item => {
        const user: FleetCompanyUser = {
          id: item.id,
          companyName: item.companyName,
          fullName: item.fullName,
          email: item.email,
          companyId: item.companyId,
          role: item.role ? item.role : 'UNKNOWN',
          phone: item.mobilePhone
        };
        const key = item.companyName;

        if (!(key in users)) {
          users[key] = [];
        }
        users[key].sort((b, a) => this.sortByName(a.fullName, b.fullName)).push(user);
      });

      return users;
    } else {
      return {};
    }
  }

  public postFamilies(families): Observable<any> {
    return this.http.post(`${FleetUrls.FLEET_POST_FAMILIES}`, families);
  }

  public getSelectedVechicle(rules): Observable<any> {
    return this.http.post(`${FleetUrls.VEHICLE_FOR_RULE}`, rules);
  }

  public postCan(can): Observable<any> {
    return this.http
      .post(`${FleetUrls.FLEET_POST_CAN}`, can, {
        responseType: 'text',
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(
        map(text => {
          try {
            return JSON.parse(text);
          } catch (_) {
            return text;
          }
        })
      );
  }

  postCustomRule(users): Observable<any> {
    return (
      this.http
        // .post(this.dataAccess_base_url + "/shares/", shareData, {
        .post(`${FleetUrls.FLEET_POST_CUSTOM_RULE}`, users, {
          responseType: 'text',
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        })
        .pipe(
          map(text => {
            try {
              return JSON.parse(text);
            } catch (_) {
              return text;
            }
          })
        )
    );
  }

  public saveFaultNotificationList(list) {
    this.faultNotificationList = [...list];
  }

  public getFaultNotificationList() {
    return this.faultNotificationList;
  }

  public filterVehicleSelection(event: any, dropdownType: string): void {
    let filteredData: any;

    const name = event.name;

    switch (dropdownType) {
      case 'FLEET_DROPDOWN':
        this.fleetDropdownTitle = name;

        if (event.id === FLEET_DEFAULT_SELECTION) {
          filteredData = this._vehicleList;
        } else {
          filteredData = {
            [event.name]: this._vehicleList[event.name]
          };
        }

        if (this.modelDropdownTitle !== this.defaultModelTitle) {
          filteredData = this.filterByModel(this.modelDropdownTitle, filteredData);
        }

        break;
      case 'MODEL_DROPDOWN':
        this.modelDropdownTitle = name;

        if (event.id === MODEL_DEFAULT_SELECTION) {
          filteredData = this._vehicleList;
        } else {
          filteredData = this.filterByModel(name, this._vehicleList);
        }

        if (this.fleetDropdownTitle !== this.defaultFleetTitle) {
          filteredData = {
            [this.fleetDropdownTitle]: filteredData[this.fleetDropdownTitle]
          };
        }

        break;
    }

    this.vehicleList$.next(filteredData);
  }

  public filterUserSelection(event: any, dropdownType: string): void {
    let filteredData: any;

    const name = event.name;

    switch (dropdownType) {
      case 'COMPANY_DROPDOWN':
        this.companyDropdownTitle = name;

        if (event.id === COMPANY_DEFAULT_SELECTION) {
          filteredData = this._userList;
        } else {
          filteredData = {
            [event.name]: this._userList[event.name]
          };
        }

        if (this.roleDropdownTitle !== this.defaultRoleTitle) {
          filteredData = this.filterByRole(this.roleDropdownTitle, filteredData);
        }

        break;
      case 'ROLE_DROPDOWN':
        this.roleDropdownTitle = name;

        if (event.id === ROLE_DEFAULT_SELECTION) {
          filteredData = this._userList;
        } else {
          filteredData = this.filterByRole(name, this._userList);
        }

        if (this.companyDropdownTitle !== this.defaultCompanyTitle) {
          filteredData = {
            [this.companyDropdownTitle]: filteredData[this.companyDropdownTitle]
          };
        }

        break;
    }

    this.userList$.next(filteredData);
  }

  public vehicleSelectionSearch(event: any): void {
    let filteredData: any;

    if (this.fleetDropdownTitle === this.defaultFleetTitle) {
      filteredData = this._vehicleList;
    } else {
      filteredData = {
        [this.fleetDropdownTitle]: this._vehicleList[this.fleetDropdownTitle]
      };
    }

    if (this.modelDropdownTitle !== this.defaultModelTitle) {
      filteredData = this.filterByModel(this.modelDropdownTitle, filteredData);
    }

    const searchString = event.searchString.toLowerCase();

    if (searchString) {
      const filteredSearchData = {};
      let filteredSearchCount = 0;

      for (const key in filteredData) {
        if (key) {
          const val = filteredData[key] as Array<any>;

          const filteredValues = val.filter(
            f =>
              f.name.toLowerCase().includes(searchString) ||
              f.id.toLowerCase().includes(searchString) ||
              f.model.toLowerCase().includes(searchString)
          );

          if (filteredValues.length > 0) {
            filteredSearchData[key] = [...filteredValues];
            filteredSearchCount++;
          }
        }
      }

      if (filteredSearchCount === 0) {
        this.fleetDropdownTitle = this.defaultFleetTitle;
        this.modelDropdownTitle = this.defaultModelTitle;
      }

      this.vehicleList$.next(filteredSearchData);
    } else {
      this.vehicleList$.next(filteredData);
    }
  }

  public userSelectionSearch(event: any): void {
    let filteredData: any;

    if (this.companyDropdownTitle === this.defaultCompanyTitle) {
      filteredData = this._userList;
    } else {
      filteredData = {
        [this.companyDropdownTitle]: this._userList[this.companyDropdownTitle]
      };
    }

    if (this.roleDropdownTitle !== this.defaultRoleTitle) {
      filteredData = this.filterByRole(this.roleDropdownTitle, filteredData);
    }

    const searchString = event.searchString.toLowerCase();

    if (searchString) {
      const filteredSearchData = {};
      let filteredSearchCount = 0;

      for (const key in filteredData) {
        if (key) {
          const val = filteredData[key] as Array<any>;

          const filteredValues = val.filter(
            f =>
              f.fullName.toLowerCase().includes(searchString) ||
              f.role.toLowerCase().includes(searchString) ||
              f.email.toLowerCase().includes(searchString)
          );

          if (filteredValues.length > 0) {
            filteredSearchData[key] = [...filteredValues];
            filteredSearchCount++;
          }
        }
      }

      if (filteredSearchCount === 0) {
        this.companyDropdownTitle = this.defaultCompanyTitle;
        this.roleDropdownTitle = this.defaultRoleTitle;
      }

      this.userList$.next(filteredSearchData);
    } else {
      this.userList$.next(filteredData);
    }
  }

  private filterByModel(model: string, dataToFilter: any): any {
    const filteredData = {};

    for (const key in dataToFilter) {
      if (key) {
        const data = dataToFilter[key];
        for (let i = 0; i < data.length; i++) {
          if (data[i].model === model) {
            if (!(key in filteredData)) {
              filteredData[key] = [];
            }

            filteredData[key].push(data[i]);
          }
        }
      }
    }
    return filteredData;
  }

  private filterByRole(role: string, dataToFilter: any): any {
    const filteredData = {};

    for (const key in dataToFilter) {
      if (key) {
        const data = dataToFilter[key];
        for (let i = 0; i < data.length; i++) {
          if (data[i].role === role) {
            if (!(key in filteredData)) {
              filteredData[key] = [];
            }

            filteredData[key].push(data[i]);
          }
        }
      }
    }
    return filteredData;
  }
}
