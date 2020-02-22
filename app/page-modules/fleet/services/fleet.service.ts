import { Injectable } from '@angular/core';
import { ApiService } from '@services/api/api.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { BehaviorSubject } from 'rxjs';

import { AppSettingsService } from '@services/app-settings/app-settings.service';
import { FleetFilterDataStoreService } from './fleet-filter-data-store/fleet-filter-data-store.service';
import { FleetUtilService } from './fleet-util/fleet-util.service';
import { UtilService } from '@services/util/util.service';

interface Vehicle {
  brand: string;
  climateIcon?: string;
  fleets: any;
  id: string;
  image: string;
  isDisconnected?: Boolean;
  lastUpdate: string;
  location: Array<any>;
  model: string;
  name: string;
  serialNumber: string;
  status: string;
  type: string;
}

interface FaultHistoryItem {
  index: number;
  engineHours: { value: number; unit: string } | string;
  created: string;
}

@Injectable({
  providedIn: 'root'
})
export class FleetService {
  private vehicleType = {};
  private fleetType = {};
  private fleetTypeCollapse = {};
  private vehicleTypeCollapse = {};

  private filterOptions = [
    { id: 'fleet', name: 'Fleet' },
    { id: 'vehicleType', name: 'Vehicle Type' }
  ];

  faultSeverity = ['LOW', 'MEDIUM', 'HIGH'];

  faultSource = [];

  selectedAttr = 'date';
  selectedOrder = true;
  elementCount;
  x = 0;
  y = 0;
  vId;
  vName;
  private filterValue = 'fleet';
  private collapse = 'true';
  private titleValue = 'Vehicles';
  private dataSource;
  private faultHistorySource;
  private unitsDataSource;

  public _fleetType = new BehaviorSubject({});
  public fleetType$ = this._fleetType.asObservable();

  public _vehicleType = new BehaviorSubject({});
  public vehicleType$ = this._vehicleType.asObservable();

  public _fleetTypeCollapse = new BehaviorSubject({});
  public fleetTypeCollapse$ = this._fleetTypeCollapse.asObservable();

  public _faultsDataLoaded = new BehaviorSubject(false);
  public faultsDataLoaded$ = this._faultsDataLoaded.asObservable();

  public _faultData = new BehaviorSubject(0);
  public faultData$ = this._faultData.asObservable();

  public _vId = new BehaviorSubject(0);
  public vId$ = this._vId.asObservable();

  public _fCode = new BehaviorSubject(0);
  public fCode$ = this._fCode.asObservable();

  public _fTitle = new BehaviorSubject(0);
  public fTitle$ = this._fTitle.asObservable();

  public _vName = new BehaviorSubject(0);
  public vName$ = this._vName.asObservable();

  public _elementCount = new BehaviorSubject(0);
  public elementCount$ = this._elementCount.asObservable();

  public _clickedId = new BehaviorSubject(0);
  public clickedId$ = this._clickedId.asObservable();

  historySortOrder: any;
  historySortAttr: any;
  showCanFeature: any = false;
  selectedOption: any = 'details';
  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    private filterDataStore: FleetFilterDataStoreService,
    private _fleetUtilService: FleetUtilService,
    private http: HttpClient,
    private utilService: UtilService,
    private appSettingsService: AppSettingsService
  ) {
    this.filterDataStore.filteredUnitsData$.subscribe(response => {
      if (response) {
        this.unitsDataSource = response;
        this.filterResponse(response);
      }
    });
  }

  filterResponse(response) {
    this.sortBy('vehicleName', false);

    this.fleetType = { connected: {}, disconnected: {} };
    this.fleetTypeCollapse = {};

    this.vehicleType = { connected: {}, disconnected: {} };
    this.vehicleTypeCollapse = {};

    response.forEach(unit => {
      unit.fleets.forEach(fleet => {
        let _isVehicleDisconnected: boolean;

        if (unit.capabilities) {
          _isVehicleDisconnected = unit.capabilities.isDisabled;
        }
        let _imageURL: string;
        if (_isVehicleDisconnected) {
          _imageURL = this._fleetUtilService.getDisconnectedVehicleImageURL(
            unit.brand,
            unit.type,
            unit.modelIcon
          );
        } else {
          _imageURL = this.utilService.getImageUrl(unit);
        }

        const vehicle: Vehicle = {
          brand: unit.brand,
          fleets: [fleet],
          id: unit.id,
          isDisconnected: _isVehicleDisconnected,
          image: _imageURL,
          lastUpdate: unit.lastUpdate,
          location: unit.location,
          model: unit.model,
          name: unit.name,
          serialNumber: unit.serialNumber,
          status: unit.status,
          type: unit.type
        };

        if (this._fleetUtilService.isDeviceTypeCFV(unit.capabilities)) {
          vehicle.climateIcon = 'assets/climate/climate-fav.png';
        }

        const _fleetName = fleet['name'];
        const _disconnectedFleet = _fleetName + ' - Disconnected Vehicles';
        const _vehicleType = unit.type.name;
        const _disconnectedVType = _vehicleType + ' - Disconnected Vehicles';

        if (!(_fleetName in this.fleetType['connected'])) {
          if (_isVehicleDisconnected) {
            this.fleetType['disconnected'][_disconnectedFleet] = [];
            this.fleetType['disconnected'][_disconnectedFleet].push(vehicle);
          } else {
            this.fleetType['connected'][_fleetName] = [];
            this.fleetType['connected'][_fleetName].push(vehicle);
          }
          this.fleetTypeCollapse[_fleetName] = false;
        } else {
          if (_isVehicleDisconnected) {
            if (!(_disconnectedFleet in this.fleetType['disconnected'])) {
              this.fleetType['disconnected'][_disconnectedFleet] = [];
            }
            this.fleetType['disconnected'][_disconnectedFleet].push(vehicle);
          } else {
            this.fleetType['connected'][_fleetName].push(vehicle);
          }

          this.fleetTypeCollapse[_fleetName] = false;
        }

        if (!(_vehicleType in this.vehicleType['connected'])) {
          if (_isVehicleDisconnected) {
            this.vehicleType['disconnected'][_disconnectedVType] = [];
            this.vehicleType['disconnected'][_disconnectedVType].push(vehicle);
          } else {
            this.vehicleType['connected'][_vehicleType] = [];
            this.vehicleType['connected'][_vehicleType].push(vehicle);
          }
        } else {
          if (_isVehicleDisconnected) {
            if (!(_disconnectedVType in this.vehicleType['disconnected'])) {
              this.vehicleType['disconnected'][_disconnectedVType] = [];
            }
            this.vehicleType['disconnected'][_disconnectedVType].push(vehicle);
          } else {
            this.vehicleType['connected'][_vehicleType].push(vehicle);
          }
        }
        this.vehicleTypeCollapse[_vehicleType.name] = false;
      });
    });

    this._fleetType.next(this.fleetType);
    this._vehicleType.next(this.vehicleType);

    this._fleetTypeCollapse.next(this.fleetTypeCollapse);
  }

  getVehicleType() {
    return this.vehicleType;
  }

  getFleetType() {
    return this.fleetType;
  }

  getCollapseValue() {
    return this.collapse;
  }

  updateFilterOptionValue(index, value) {
    this.filterOptions[index].name = value;
  }

  getFilterOptions() {
    return this.filterOptions;
  }

  getTitleValue() {
    return this.titleValue;
  }

  getFilterValue() {
    return this.filterValue;
  }

  getFleetTypeCollapse() {
    return this.fleetTypeCollapse;
  }

  getVehicleTypeCollapse() {
    return this.vehicleTypeCollapse;
  }

  setFilterValue(value) {
    this.filterValue = value;
  }

  setCollapseValue(value) {
    this.collapse = value;
  }

  setDataSource(source) {
    this.dataSource = source;
  }

  getDataSource() {
    return this.dataSource;
  }

  sortBy(attr, order) {
    if (order) {
      this.x = 1;
      this.y = -1;
    } else {
      this.x = -1;
      this.y = 1;
    }
    switch (attr) {
      case 'vehicleName':
        this.unitsDataSource.sort((a, b) =>
          this.sortFunc(a.name.toLowerCase(), b.name.toLowerCase())
        );
        break;

      case 'name':
        this.dataSource.sort((a, b) =>
          this.sortFunc(this.toLowerCase(a.title), this.toLowerCase(b.title))
        );
        break;
      case 'status':
        this.dataSource.sort((a, b) => this.sortFunc(b.active, a.active));
        break;

      case 'severity':
        this.dataSource.sort((a, b) =>
          this.sortFunc(
            this.faultSeverity.indexOf(a.severity),
            this.faultSeverity.indexOf(b.severity)
          )
        );
        break;
      case 'fault-id':
        this.dataSource.sort((a, b) => this.sortFunc(a.code, b.code));
        break;
      case 'source':
        this.dataSource.sort((a, b) => this.sortFunc(a.source, b.source));
        break;
      case 'date':
        this.dataSource.sort((a, b) => this.sortFunc(a.created, b.created));
        break;
      case 'created':
        this.faultHistorySource.sort((a, b) => this.sortFunc(a.created, b.created));
        break;
      case 'hours':
        this.faultHistorySource.sort((a, b) =>
          this.sortFunc(a.engineHours.value, b.engineHours.value)
        );
        break;
      case 'index':
        this.faultHistorySource.sort((a, b) => this.sortFunc(a.index, b.index));
        break;
    }
  }

  sortFunc(a, b) {
    if (a < b) {
      return this.x;
    }

    if (a > b) {
      return this.y;
    }

    return 0;
  }

  toLowerCase(str) {
    return str.toLowerCase();
  }

  setupFaultsData(content) {
    const source = content;

    this.elementCount = content.length;

    this._elementCount.next(this.elementCount);
    if (source) {
      source.sort((a, b) => this.sortFunc(a['this.selectedAttr'], b['this.selectedAttr']));
      source.forEach(element =>
        this.faultSource.push({
          element: false
        })
      );
    }

    this.dataSource = source;

    this.sortBy(this.selectedAttr, this.selectedOrder);

    return this.dataSource;
  }

  setupFaultsHistoryData(response) {
    this.faultHistorySource = [];

    if (response && response['content']) {
      response['content'].forEach(item => {
        const _faultHistoryItem: FaultHistoryItem = {
          created: item.created,
          index: item.index,
          engineHours: item.assetDetail ? this.setEngineHours(item.assetDetail.engineHours) : 'NaN'
        };
        this.faultHistorySource.push(_faultHistoryItem);
      });

      this.sortBy(this.historySortAttr, this.historySortOrder);
    }

    return this.faultHistorySource;
  }

  setEngineHours(assetDetail) {
    return { value: assetDetail.value, unit: assetDetail.unit };
  }
  setHistorySortOrder(order) {
    this.historySortOrder = order;
  }
  setHistorySortAttr(attr) {
    this.historySortAttr = attr;
  }

  getMaintenanceConfiguration(id) {
    return this.http.get(
      `https://eucrmactapimgmtc01.azure-api.net/crm/int/b2c/api/v1.0/Maintenance/GetMaintenanceTasksByEquipmentID?EquipmentId=${id}&StatusReasonCodes=1`
    );
  }

  getCompanyId(companyName) {
    return this.http.get(
      `https://eucrmactapimgmtc01.azure-api.net/crm/mkt/b2c/api/v1.1/Company/SearchCompany?CompanyName=${companyName}`
    );
  }

  getEquipmentId(companyId) {
    return this.http.get(
      `https://eucrmactapimgmtc01.azure-api.net/crm/mkt/b2c/api//v1.1/Device/GetDevicesByCompanyId?CompanyId=${companyId}`
    );
  }

  displayTasks(id) {
    return this.apiService.getMaintenanceConfiguration();
  }

  public getCanFeature() {
    this.appSettingsService.getAppSettings().subscribe(res => {
      if (res.canFeature === 'true') {
        this.showCanFeature = true;
      }
    });
  }
}
