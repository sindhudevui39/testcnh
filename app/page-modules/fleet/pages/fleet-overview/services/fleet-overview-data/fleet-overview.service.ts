import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { UtilService } from '@services/util/util.service';
import { FleetUtilService } from '@fleet/services/fleet-util/fleet-util.service';

import { Status, StatusColors } from '@services/constants';
import { OverviewListvehicleData, EngineHoursData } from '../../overview.models';
import {
  engineOffDPCodes,
  idleDPCodes,
  movingDPCodes,
  keyOnDPCodes,
  travellingDPCodes
} from '../../overview.properties';

@Injectable({
  providedIn: 'root'
})
export class FleetOverviewService {
  private _overviewData = {};
  private _uniqueTypes = [];
  private _filteredAllowedParamsForDialog = [];
  private _collapseState = {};
  private _refData = [];
  private _allowedParamsData: any;
  public _userPreferencesData: any;
  public collapseState$ = new BehaviorSubject(this._collapseState);
  public overviewData$ = new BehaviorSubject(null);

  constructor(private _util: UtilService, private _fleetUtilService: FleetUtilService) {}
  setUserPreferences(data) {
    this._userPreferencesData = data;
  }
  public updatePanelData(userPreferenceData, allowedParamsData) {
    const panelData = [];

    panelData.push(userPreferenceData);
    panelData.push(allowedParamsData);

    this._allowedParamsData = allowedParamsData;
    this._userPreferencesData = userPreferenceData;
  }

  getFormattedOverviewData(unitsData) {
    this._uniqueTypes = [];

    this._refData = [...unitsData];

    this._refData.forEach(element => {
      if (this._uniqueTypes.indexOf(element['type']['code']) < 0) {
        this._uniqueTypes.push(element['type']['code']);
      }
    });

    this.buildOverviewPageData();

    return this._overviewData;
  }

  buildOverviewPageData() {
    this._filteredAllowedParamsForDialog = this.dialogParams();
    this._overviewData = { connected: {}, disconnected: {} };
    this._refData.forEach(unit => {
      unit.fleets.forEach(fleet => {
        const _params = unit.parameters;

        const allowedparamsList = this.getAllowedParamList(unit.type.code);

        const customValues = this.getCustomValues(unit.type.code, _params, unit.status);

        let customLabelValues: Array<string>;
        if (allowedparamsList.length > 0) {
          customLabelValues = this.assignToDialogParam(
            customValues,
            unit['type'],
            allowedparamsList[0].allowedParameters
          );
        } else {
          customLabelValues = ['', ''];
        }
        const _isClimateVehicle = this._fleetUtilService.isDeviceTypeCFV(unit.capabilities);

        let _isVehicleDisconnected = false;
        if (unit.capabilities && unit.capabilities.isDisabled) {
          _isVehicleDisconnected = true;
        }

        // Vehicle Images
        let _imageURL: string;
        if (_isVehicleDisconnected) {
          _imageURL = this._fleetUtilService.getDisconnectedVehicleImageURL(
            unit.brand,
            unit.type,
            unit.modelIcon
          );
        } else {
          _imageURL = this._util.getImageUrl(unit);
        }

        const _vehicle: OverviewListvehicleData = {
          brand: unit.brand,
          capabilities: unit.capabilities,
          custom1: customValues.length > 0 ? customValues[0][0] : [],
          custom2: customValues.length > 0 ? customValues[1][0] : [],
          custom1ParamLabel: customLabelValues[0],
          custom2ParamLabel: customLabelValues[1],
          engineHoursData: this.getEngineHoursData(unit.parameters),
          fleets: [fleet.name],
          image: _imageURL,
          id: unit.id,
          isClimateVehicle: _isClimateVehicle,
          isClimateVehicleDisconneted: _isVehicleDisconnected,
          lastUpdate: unit.lastUpdate,
          model: unit.model,
          name: unit.name,
          status: unit.status,
          statusColor: unit.status ? StatusColors[unit.status.name] : 'transparent',
          statusName: unit.status ? unit.status.name : 'UNKNOWN',
          statusText: unit.status ? Status[unit.status.name] : 'Unknown',
          serialNumber: unit.serialNumber,
          statusALERTS: unit.statusALERTS,
          type: unit.type
        };

        const _fleetName = fleet['name'];
        const _disconnectedFleet = _fleetName + ' - Disconnected Vehicles';
        if (!(fleet['name'] in this._overviewData['connected'])) {
          if (_isVehicleDisconnected) {
            this._overviewData['disconnected'][_disconnectedFleet] = [];
            this._overviewData['disconnected'][_disconnectedFleet].push(_vehicle);
          } else {
            this._overviewData['connected'][_fleetName] = [];
            this._overviewData['connected'][_fleetName].push(_vehicle);
          }
        } else {
          if (_isVehicleDisconnected) {
            if (!(_disconnectedFleet in this._overviewData['disconnected'])) {
              this._overviewData['disconnected'][_disconnectedFleet] = [];
            }
            this._overviewData['disconnected'][_disconnectedFleet].push(_vehicle);
          } else {
            this._overviewData['connected'][_fleetName].push(_vehicle);
          }
        }
      });
    });
  }

  dialogParams() {
    const filteredParams = this._allowedParamsData
      .filter(
        paramsData =>
          this._uniqueTypes.indexOf(paramsData.code) >= 0 || this.checkForTypeConditions(paramsData)
      )
      .map(item => {
        item['image'] = this._util.getImageByName(item.name);
        return item;
      });

    return filteredParams;
  }

  checkForTypeConditions(paramsData) {
    if (this._uniqueTypes.indexOf('FLOATERS') >= 0 && paramsData.code.includes('SPRAYERS')) {
      return true;
    }
    return false;
  }

  getAllowedParamList(code): Array<any> {
    let _allowedParams = [];
    if (code.includes('FLOATERS')) {
      _allowedParams = this._allowedParamsData.filter(
        allowedParams =>
          allowedParams.code.includes('FLOATERS') || allowedParams.code.includes('SPRAYERS')
      );
    } else {
      _allowedParams = this._allowedParamsData.filter(allowedParams => allowedParams.code === code);
    }
    return _allowedParams;
  }

  getCustomValues(code, parametres, status): Array<any> {
    let customParamsData = [];

    this._userPreferencesData['canFamilyCodesPref'].forEach(preference => {
      if (code.includes('FLOATERS')) {
        if (preference['vehicleTypeCode'].includes('SPRAYERS')) {
          customParamsData = this.getCustomParamsData(preference, parametres, status);
        }
      } else {
        if (preference['vehicleTypeCode'] === code) {
          customParamsData = this.getCustomParamsData(preference, parametres, status);
        }
      }
    });

    return customParamsData;
  }

  getCustomParamsData(preference, parameters, status) {
    let code1 = '';
    let code2 = '';
    let newArray = [];

    let _Param1Data = {
      value: 'N/A',
      unit: ''
    };
    let _Param2Data = {
      value: 'N/A',
      unit: ''
    };
    if (preference.canFamilyCodes[0]['index'] === 1) {
      code1 = preference.canFamilyCodes[0]['code'];
      code2 = preference.canFamilyCodes[1]['code'];
    } else {
      code1 = preference.canFamilyCodes[1]['code'];
      code2 = preference.canFamilyCodes[0]['code'];
    }

    if (parameters) {
      const param1 = parameters.filter(el => el.code === code1)[0];
      const param2 = parameters.filter(el => el.code === code2)[0];

      if (param1) {
        const isSetCDValueToDashes = this.setCustomDisplayDashes(code1, status.name);
        if (isSetCDValueToDashes) {
          _Param1Data.value = '--';
          if (status.name.toLowerCase() === 'idle' && code1 === 'GROUND_SPEED') {
            _Param1Data.value = '0';
          }
        } else {
          _Param1Data = {
            value: param1.value.toFixed(2),
            unit: param1.unit
          };
        }
        newArray.push([_Param1Data, code1]);
      } else {
        newArray.push([_Param1Data, code1]);
      }

      if (param2) {
        const isSetCDValueToDashes = this.setCustomDisplayDashes(code2, status.name);
        if (isSetCDValueToDashes) {
          _Param2Data.value = '--';

          if (status.name.toLowerCase() === 'idle' && code2 === 'GROUND_SPEED') {
            _Param2Data.value = '0';
          }
        } else {
          _Param2Data = {
            value: param2.value.toFixed(2),
            unit: param2.unit
          };
        }
        newArray.push([_Param2Data, code2]);
      } else {
        newArray.push([_Param2Data, code2]);
      }
    } else {
      newArray = [[_Param2Data, code1], [_Param2Data, code2]];
    }

    return newArray;
  }

  setCustomDisplayDashes(code, status) {
    if (code) {
      if (status.toLowerCase() === 'off') {
        if (engineOffDPCodes.indexOf(code) > 0) {
          return false;
        }
      }

      if (status.toLowerCase() === 'idle') {
        if (idleDPCodes.indexOf(code) > 0) {
          return false;
        }
      }

      if (status.toLowerCase() === 'moving') {
        if (movingDPCodes.indexOf(code) > 0) {
          return false;
        }
      }

      if (status.toLowerCase() === 'keyon') {
        if (keyOnDPCodes.indexOf(code) > 0) {
          return false;
        }
      }

      if (status.toLowerCase() === 'traveling') {
        if (travellingDPCodes.indexOf(code) > 0) {
          return false;
        }
      }

      if (status.toLowerCase() === 'working') {
        return false;
      }
    }

    return true;
  }

  assignToDialogParam(customValues, type, allowedParams) {
    let customParamLabels = [];
    this._filteredAllowedParamsForDialog.forEach(filteredElement => {
      if (type.code.includes('FLOATERS') && filteredElement['code'].includes('SPRAYERS')) {
        customParamLabels = this.getSelectedCustomLabels(
          filteredElement,
          allowedParams,
          customValues
        );
      } else {
        if (filteredElement['code'] === type['code']) {
          customParamLabels = this.getSelectedCustomLabels(
            filteredElement,
            allowedParams,
            customValues
          );
        }
      }
    });

    return customParamLabels;
  }

  getSelectedCustomLabels(element, allowedParams, customValues) {
    const param1Label = allowedParams.filter(param => param.code === customValues[0][1])[0];
    const param2Label = allowedParams.filter(param => param.code === customValues[1][1])[0];

    element['custom1SelectedParam'] = param1Label.name;
    element['custom2SelectedParam'] = param2Label.name;
    element['custom1SelectedParamCode'] = param1Label.code;
    element['custom2SelectedParamCode'] = param2Label.code;

    return [param1Label.name, param2Label.name];
  }

  getEngineHoursData(parameters): EngineHoursData {
    let _hoursData = {
      value: ' ',
      unit: ''
    };
    if (parameters) {
      const data = parameters.filter(param => param.code === 'ENG_HOURS')[0];
      if (data) {
        const enginedata: EngineHoursData = {
          value: data.value.toFixed(2),
          unit: data.unit
        };
        _hoursData = enginedata;
      }
    }

    return _hoursData;
  }
  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  // Collpase State
  setCollapseStateFalse() {
    for (const item in this._overviewData) {
      if (item) {
        for (const company in this._overviewData[item]) {
          if (company) {
            this._collapseState[company] = false;
          }
        }
      }
    }
    this.collapseState$.next(this._collapseState);
  }

  getCollapseState() {
    return this._collapseState;
  }

  changeCollapseState(changedKey) {
    for (const key in this._collapseState) {
      if (key === changedKey) {
        this._collapseState[key] = !this._collapseState[key];
      }
    }
    this.collapseState$.next(this._collapseState);
  }
}
