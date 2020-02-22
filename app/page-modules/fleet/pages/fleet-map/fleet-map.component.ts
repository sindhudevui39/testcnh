/*
 Copyright 2018 Esri
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
   http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import { loadModules } from 'esri-loader';
import esri = __esri;
import { Urls } from '@enums/urls.enum';
import { BrandNames, BrandColors } from '@enums/brand.enum';
import { UserService } from '@services/user/user.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { FleetDataService } from '@fleet/services/fleet-data.service';
import { DatePipe } from '@angular/common';
import { ApiService } from '@services/api/api.service';
import { ToolbarToggleFilterbarService } from '@fleet/services/events/toolbar-toggle-filterbar.service';
import { TranslateService } from '@ngx-translate/core';
import { FleetFilterDataStoreService } from '@fleet/services/fleet-filter-data-store/fleet-filter-data-store.service';
import { Location } from '@angular/common';
import { markParentViewsForCheck } from '@angular/core/src/view/util';
import { Popup } from 'auth0-js';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { FleetService } from '../../services/fleet.service';
import { SelectedVehicleService } from '@fleet/services/events/selected-vehicle.service';
import { UtilService } from '@services/util/util.service';
import { NavmapService } from '@fleet/services/navmap.service';
import { FaultsFilterDataService } from '@fleet/services/fleet-faults-filter-data/faults-filter-data.service';
import { NgZone } from '@angular/core'; // import ngZone library
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import { FleetVehicleListComponent } from '@fleet/components/fleet-vehicle-list/fleet-vehicle-list.component';
import { RemoteDisplayService } from '@remote-display/services/remote-display/remote-display.service';
import { MapSettings } from 'src/app/shared/map-settings';
import { AppSettingsService } from '@services/app-settings/app-settings.service';

@Component({
  selector: 'app-fleet-map',
  templateUrl: './fleet-map.component.html',
  styleUrls: ['./fleet-map.component.css'],
  providers: [FleetVehicleListComponent],
  animations: [
    trigger('collapseVehicles', [
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
export class FleetMapComponent implements OnInit, OnDestroy {
  imageUrl: any;
  map: esri.Map;
  // private mapView: esri.MapView;
  mapViewProperties: any;
  public mapView: esri.MapView;

  filtersBarOpen: boolean;
  _refData: any;
  @ViewChild('mapViewNode') public mapViewEl: ElementRef;

  /**
   * @private _zoom sets map zoom
   * @private _center sets map center
   * @private _basemap sets type of map
   */
  private _zoom = 10;
  private _center: Array<number> = [0.1278, 51.5074];
  private _basemap = 'gray';
  vehicleData: any;
  totalMapheight: string;
  result: any = this.translate.instant('PAGE_MAIN.ALERTS.NO_ACTIVE_ALERTS');
  //  ------------------------------------------New

  @ViewChild(PerfectScrollbarComponent)
  public directiveScroll: PerfectScrollbarComponent;
  @ViewChild('listPS', { read: ElementRef }) public panel: ElementRef<any>;
  public brands = BrandNames;

  [x: string]: any;

  @Input()
  vehicleId;

  @Input()
  selectedValue;
  collapse;

  fleetType = {};

  vehicleType = {};
  titleValue;
  filterValue = 'fleet';
  filterOptions = [];
  selectedFilterOption: string;
  fleetTypeCollapse = {};
  vehicleTypeCollapse = {};
  vehicleTypeSize = {};
  fleetTypeSize = {};
  filtersBarOpen1: boolean;

  showReset = false;
  clickedId;
  showLoader = true;
  sctollTopPosition = 0;
  mapDataLoaded = true;
  fullscreencheck = false;

  speedUnit: any = '';
  layerList: any;
  vehicleDetail: any = null;
  // ------------------------------

  displayRDVOption = false;
  private _rdvInitiatedSubscription: Subscription;

  public disableRemoteDisplay: boolean;

  rdvStatusMsg: string;

  public globalVDetail: any;
  constructor(
    private _appSettings: AppSettingsService,
    private _remoteDisplay: RemoteDisplayService,
    private userService: UserService,
    public _router: Router,
    public fleetdata: FleetDataService,
    public datepipe: DatePipe,
    public apiService: ApiService,
    toggleFilterBarService: ToolbarToggleFilterbarService,
    public readonly translate: TranslateService,
    public fleetFilterDataStore: FleetFilterDataStoreService,
    public location: Location,
    public _location: Location,
    private _http: HttpClient,
    public fleetService: FleetService,
    public selectedVehicleService: SelectedVehicleService,
    public _fleetfilterStore: FleetFilterDataStoreService,
    public utilService: UtilService,
    public elem: ElementRef,
    public navMapService: NavmapService,
    public faultFiltersDataService: FaultsFilterDataService,
    public elRef: ElementRef,
    public router: Router,
    public translateService: TranslateService,
    private ngZone: NgZone,
    private _userService: UserService,
    private fleetVehicleList: FleetVehicleListComponent
  ) {
    this.navMapService.mapFirstLoad = true;
    toggleFilterBarService.openFiltersBar$.subscribe(value => {
      this.filtersBarOpen = value;
      this.totalMapheight = this.calulateHeight();
    });

    this.fullScreencheck = true;

    window.onresize = e => {
      ngZone.run(() => {
        if (this.fullscreencheck) {
          // alert("im in full screen");
          this.totalMapheight = window.innerHeight + 'px';
          this.fullScreencheck = false;
        } else {
          // alert("im not in full screen");
          this.totalMapheight = this.calulateHeight();
          this.fullScreencheck = true;
        }
      });
    };

    this.translateService.get('GLOBAL.FLEET.SINGULAR').subscribe(data => {
      if (this.fleetService.getFilterValue() === 'fleet') {
        this.selectedFilterOption = data;
      }
      this.fleetService.updateFilterOptionValue(0, data);
    });
    this.translateService.get('GLOBAL.VEHICLE_TYPE').subscribe(data => {
      if (this.fleetService.getFilterValue() === 'vehicleType') {
        this.selectedFilterOption = data;
      }
      this.fleetService.updateFilterOptionValue(1, data);
    });

    toggleFilterBarService.openFiltersBar$.subscribe(value => {
      this.filtersBarOpen1 = value;
    });
    this.initializeMap('');

    // this.mapDataLoaded = true;
    this.fleetdata.showMapVehicleInfo = false;
  }

  async initializeMap(vehicle: any) {
    // alert("test");

    try {
      const [
        EsriMap,
        EsriSceneView,
        MapView,
        EsriPoint,
        EsriLegend,
        EsriRequest,
        EsriConfig,
        EsriFeatureLayer,
        EsriSearch,
        UniqueValueRenderer,
        PopupTemplate,
        LabelClass,
        jsonUtils,
        Expand,
        LayerList,
        BasemapGallery,
        Zoom,
        Locate,
        fcl,
        SimpleMarkerSymbol,
        SimpleLineSymbol,
        SimpleFillSymbol,
        TextSymbol,
        TextSymbol3DLayer,
        Font,
        ClassBreaksRenderer,
        watchUtils,
        webMercatorUtils,
        SpatialReference,
        Color,
        Graphic,
        Fullscreen,
        Extent,
        dom,
        Compass,
        PortalSource,
        Camera
      ] = await loadModules([
        'esri/Map',
        'esri/views/SceneView',
        'esri/views/MapView',
        'esri/geometry/Point',
        'esri/widgets/Legend',
        'esri/request',
        'esri/config',
        'esri/layers/FeatureLayer',
        'esri/widgets/Search',
        'esri/renderers/UniqueValueRenderer',
        'esri/PopupTemplate',
        'esri/layers/support/LabelClass',
        'esri/symbols/support/jsonUtils',
        'esri/widgets/Expand',
        'esri/widgets/LayerList',
        'esri/widgets/BasemapGallery',
        'esri/widgets/Zoom',
        'esri/widgets/Locate',
        // 'http://tl0235085.cnh1.cnhgroup.cnh.com:8080/fcl/flareclusterlayer_v4.js',
        'https://euevoawain050.azurewebsites.net/fcl/flareclusterlayer_v4.js',
        'esri/symbols/SimpleMarkerSymbol',
        'esri/symbols/SimpleLineSymbol',
        'esri/symbols/SimpleFillSymbol',
        'esri/symbols/TextSymbol',
        'esri/symbols/TextSymbol3DLayer',
        'esri/symbols/Font',
        'esri/renderers/ClassBreaksRenderer',
        'esri/core/watchUtils',
        'esri/geometry/support/webMercatorUtils',
        'esri/geometry/SpatialReference',
        'dojo/_base/Color',
        'esri/Graphic',
        'esri/widgets/Fullscreen',
        'esri/geometry/Extent',
        'dojo/dom',
        'esri/widgets/Compass',
        'esri/widgets/BasemapGallery/support/PortalBasemapsSource',
        'esri/Camera'
      ]);

      let map, sceneView, activeView, graphics, clusterLayer;

      // set some defaults
      const maxSingleFlareCount = 5;
      const areaDisplayMode = 'activated';
      let flagcheck: Boolean = false;

      const node = dom.byId('mapid');

      const dojoConfig = {
        async: true,
        tlmSiblingOfDojo: false,
        packages: [
          {
            name: 'fcl',
            location: location.pathname.replace(/\/[^/]+$/, '') + '/fcl'
          }
        ],
        has: {
          // tslint:disable-next-line:max-line-length
          'esri-promise-compatibility': 1 // enable native promises and remove the warning about using when() instead of then(). https://developers.arcgis.com/javascript/latest/guide/release-notes/index.html#improved-compatibility-with-javascript-promises
        }
      };

      // const map: esri.Map = new EsriMap(mapProperties);
      this.map = new EsriMap({
        basemap: 'hybrid',
        ground: 'world-elevation'
      });

      if (vehicle) {
        // Set type of map view
        this.mapViewProperties = {
          popup: {
            dockEnabled: true,
            dockOptions: {
              // Disables the dock button from the popup
              buttonEnabled: false,
              // Ignore the default sizes that trigger responsive docking
              breakpoint: false
            }
            // actions:[]
          },
          container: this.mapViewEl.nativeElement,
          center: [vehicle.location[1], vehicle.location[0]],
          zoom: 18,
          map: this.map,
          constraints: {
            altitude: {
              min: 1000
            }
          }
        };
      } else {
        this.mapViewProperties = {
          popup: {
            dockEnabled: true,
            dockOptions: {
              // Disables the dock button from the popup
              buttonEnabled: false,
              // Ignore the default sizes that trigger responsive docking
              breakpoint: false
            }
            // actions:[]
          },
          container: this.mapViewEl.nativeElement,

          // center: [-97.922211, 39.381266],
          // zoom: 3,
          map: this.map,
          constraints: {
            altitude: {
              min: 1000
            }
          }
        };

        // this.mapViewProperties.constraints.rotationEnabled = false;
      }
      // this.MapViewProperties.surface.style.cursor = "pointer";

      this.mapView = new EsriSceneView(this.mapViewProperties);

      let data1 = [];
      const fields = [
        {
          name: 'ObjectID',
          alias: 'ObjectID',
          type: 'oid'
        },
        {
          name: 'name',
          alias: 'Name',
          type: 'string'
        }
      ];
      const points = [];
      const pointsL = [];
      let pointsLayer;
      let pointsLayerL;
      let i = 0;

      this.fleetFilterDataStore.filteredUnitsData$.subscribe(fData => {
        const id = document.getElementById('vId');
        if (id !== null) {
          let vehicl = null;
          for (let index = 0; index < fData.length; index++) {
            const element = fData[index].id;
            if (element === id['value']) {
              vehicl = fData[index];
              this.changePopupContent(vehicl);
            }
          }
        }
        if (fData && fData.length > 0) {
          this._refData = fData;
          this.mapView.when(() => {
            data1 = [];
            this.map.remove(clusterLayer);
            this.map.remove(pointsLayerL);
            // alert("call");

            const tractors = this._refData.filter(unit => {
              return unit['capabilities']
                ? unit['capabilities']['isDisabled']
                  ? false
                  : true
                : true;
            });

            this.vehicleData = tractors;
            for (let j = 0; j < tractors.length; j++) {
              if (tractors[j].location) {
                if (vehicle.id === tractors[j].id) {
                  data1.push({
                    Id: j,
                    x: tractors[j].location[1],
                    y: tractors[j].location[0],
                    brand: tractors[j].brand,
                    brandCode: tractors[j].brandCode,
                    heading: tractors[j].heading,
                    id: tractors[j].id,
                    model: tractors[j].model,
                    name: tractors[j].name,
                    serialNumber: tractors[j].serialNumber,
                    speed: tractors[j].speed,
                    status: this.translate.instant(
                      'GLOBAL.VEHICLE.STATUS.' + tractors[j].status.name
                    ),
                    type: tractors[j].type.code,
                    value: tractors[j].type.code,
                    imgName: this.getimage(tractors[j]),
                    engHours: this.getVehicleDetail('engHours', tractors[j]),
                    groundSpeed: this.getVehicleDetail('speed', tractors[j]),
                    engHoursText: this.translate.instant('PAGE_FAULTS.ENGINE_HOURS'),
                    fuelLevelText: this.translate.instant('BALLOON.VEHICLE.FUEL_LEVEL'),
                    currentSpeedText: this.translate.instant('BALLOON.VEHICLE.CURRENT_SPEED'),
                    activeAlartTxt: this.translate.instant('PAGE_MAIN.ALERTS.ACTIVE_ALERTS'),
                    vehicleDetailsTxt: this.translate.instant(
                      'BALLOON.VEHICLE.CTA.VEHICLE_DETAILS'
                    ),
                    fuelLevel: this.getVehicleDetail('fuelLevel', tractors[j]),
                    statusColor: this.checkStatus(tractors[j].status.name),
                    customstatustypebrand:
                      tractors[j].status.name + tractors[j].type.code + tractors[j].brandCode + '1',
                    brandColor: this.getBrandColor(),
                    vehicleObj: JSON.stringify(tractors[j]),
                    lastUpdate: this.getStatusDate(tractors[j].lastUpdate)
                  });
                } else {
                  if (tractors[j].modelIcon) {
                    if (tractors[j].modelIcon === 'CCH' && tractors[j].brandCode === 'CSAG') {
                      data1.push({
                        Id: j,
                        x: tractors[j].location[1],
                        y: tractors[j].location[0],
                        brand: tractors[j].brand,
                        brandCode: tractors[j].brandCode,
                        heading: tractors[j].heading,
                        id: tractors[j].id,
                        model: tractors[j].model,
                        name: tractors[j].name,
                        serialNumber: tractors[j].serialNumber,
                        speed: tractors[j].speed,
                        status: this.translate.instant(
                          'GLOBAL.VEHICLE.STATUS.' + tractors[j].status.name
                        ),
                        type: tractors[j].type.code,
                        value: tractors[j].type.code,
                        imgName: this.getimage(tractors[j]),
                        engHours: this.getVehicleDetail('engHours', tractors[j]),
                        groundSpeed: this.getVehicleDetail('speed', tractors[j]),
                        engHoursText: this.translate.instant('PAGE_FAULTS.ENGINE_HOURS'),
                        fuelLevelText: this.translate.instant('BALLOON.VEHICLE.FUEL_LEVEL'),
                        currentSpeedText: this.translate.instant('BALLOON.VEHICLE.CURRENT_SPEED'),
                        activeAlartTxt: this.translate.instant('PAGE_MAIN.ALERTS.ACTIVE_ALERTS'),
                        vehicleDetailsTxt: this.translate.instant(
                          'BALLOON.VEHICLE.CTA.VEHICLE_DETAILS'
                        ),
                        fuelLevel: this.getVehicleDetail('fuelLevel', tractors[j]),
                        statusColor: this.checkStatus(tractors[j].status.name),
                        customstatustypebrand:
                          tractors[j].status.name + tractors[j].type.code + tractors[j].brandCode,
                        brandColor: this.getBrandColor(),
                        vehicleObj: JSON.stringify(tractors[j]),
                        lastUpdate: this.getStatusDate(tractors[j].lastUpdate)
                      });
                    } else {
                      data1.push({
                        Id: j,
                        x: tractors[j].location[1],
                        y: tractors[j].location[0],
                        brand: tractors[j].brand,
                        brandCode: tractors[j].brandCode,
                        heading: tractors[j].heading,
                        id: tractors[j].id,
                        model: tractors[j].model,
                        name: tractors[j].name,
                        serialNumber: tractors[j].serialNumber,
                        speed: tractors[j].speed,
                        status: this.translate.instant(
                          'GLOBAL.VEHICLE.STATUS.' + tractors[j].status.name
                        ),
                        type: tractors[j].type.code,
                        value: tractors[j].type.code,
                        imgName: this.getimage(tractors[j]),
                        engHours: this.getVehicleDetail('engHours', tractors[j]),
                        groundSpeed: this.getVehicleDetail('speed', tractors[j]),
                        engHoursText: this.translate.instant('PAGE_FAULTS.ENGINE_HOURS'),
                        fuelLevelText: this.translate.instant('BALLOON.VEHICLE.FUEL_LEVEL'),
                        currentSpeedText: this.translate.instant('BALLOON.VEHICLE.CURRENT_SPEED'),
                        activeAlartTxt: this.translate.instant('PAGE_MAIN.ALERTS.ACTIVE_ALERTS'),
                        vehicleDetailsTxt: this.translate.instant(
                          'BALLOON.VEHICLE.CTA.VEHICLE_DETAILS'
                        ),
                        fuelLevel: this.getVehicleDetail('fuelLevel', tractors[j]),
                        statusColor: this.checkStatus(tractors[j].status.name),
                        customstatustypebrand:
                          tractors[j].status.name +
                          tractors[j].type.code +
                          tractors[j].brandCode +
                          tractors[j].modelIcon,
                        brandColor: this.getBrandColor(),
                        vehicleObj: JSON.stringify(tractors[j]),
                        lastUpdate: this.getStatusDate(tractors[j].lastUpdate)
                      });
                    }
                  } else {
                    data1.push({
                      Id: j,
                      x: tractors[j].location[1],
                      y: tractors[j].location[0],
                      brand: tractors[j].brand,
                      brandCode: tractors[j].brandCode,
                      heading: tractors[j].heading,
                      id: tractors[j].id,
                      model: tractors[j].model,
                      name: tractors[j].name,
                      serialNumber: tractors[j].serialNumber,
                      speed: tractors[j].speed,
                      status: this.translate.instant(
                        'GLOBAL.VEHICLE.STATUS.' + tractors[j].status.name
                      ),
                      type: tractors[j].type.code,
                      value: tractors[j].type.code,
                      imgName: this.getimage(tractors[j]),
                      engHours: this.getVehicleDetail('engHours', tractors[j]),
                      groundSpeed: this.getVehicleDetail('speed', tractors[j]),
                      engHoursText: this.translate.instant('PAGE_FAULTS.ENGINE_HOURS'),
                      fuelLevelText: this.translate.instant('BALLOON.VEHICLE.FUEL_LEVEL'),
                      currentSpeedText: this.translate.instant('BALLOON.VEHICLE.CURRENT_SPEED'),
                      activeAlartTxt: this.translate.instant('PAGE_MAIN.ALERTS.ACTIVE_ALERTS'),
                      vehicleDetailsTxt: this.translate.instant(
                        'BALLOON.VEHICLE.CTA.VEHICLE_DETAILS'
                      ),
                      fuelLevel: this.getVehicleDetail('fuelLevel', tractors[j]),
                      statusColor: this.checkStatus(tractors[j].status.name),
                      customstatustypebrand:
                        tractors[j].status.name + tractors[j].type.code + tractors[j].brandCode,
                      brandColor: this.getBrandColor(),
                      vehicleObj: JSON.stringify(tractors[j]),
                      lastUpdate: this.getStatusDate(tractors[j].lastUpdate)
                    });
                  }
                }

                points.push({
                  geometry: new EsriPoint({
                    x: tractors[j].location[1],
                    y: tractors[j].location[0]
                  }),
                  attributes: {
                    ObjectID: j,
                    brand: tractors[j].brand,
                    brandCode: tractors[j].brandCode,
                    heading: tractors[j].heading,
                    id: tractors[j].id,
                    model: tractors[j].model,
                    name: tractors[j].name,
                    serialNumber: tractors[j].serialNumber,
                    speed: tractors[j].speed,
                    status: this.translate.instant(
                      'GLOBAL.VEHICLE.STATUS.' + tractors[j].status.name
                    ),
                    type: tractors[j].type.code,
                    value: tractors[j].type.code,
                    imgName: this.getimage(tractors[j]),
                    engHours: this.getVehicleDetail('engHours', tractors[j]),
                    groundSpeed: this.getVehicleDetail('speed', tractors[j]),
                    engHoursText: this.translate.instant('PAGE_FAULTS.ENGINE_HOURS'),
                    fuelLevelText: this.translate.instant('BALLOON.VEHICLE.FUEL_LEVEL'),
                    currentSpeedText: this.translate.instant('BALLOON.VEHICLE.CURRENT_SPEED'),
                    activeAlartTxt: this.translate.instant('PAGE_MAIN.ALERTS.ACTIVE_ALERTS'),
                    vehicleDetailsTxt: this.translate.instant(
                      'BALLOON.VEHICLE.CTA.VEHICLE_DETAILS'
                    ),
                    fuelLevel: this.getVehicleDetail('fuelLevel', tractors[j]),
                    statusColor: this.checkStatus(tractors[j].status.name),
                    customstatustypebrand:
                      tractors[j].status.name + tractors[j].type.code + tractors[j].brandCode,
                    brandColor: this.getBrandColor(),
                    vehicleObj: JSON.stringify(tractors[j]),
                    lastUpdate: this.getStatusDate(tractors[j].lastUpdate)
                  }
                });
                pointsL.push({
                  geometry: new EsriPoint({
                    x: tractors[j].location[1],
                    y: tractors[j].location[0]
                  }),
                  attributes: {
                    ObjectID: j,
                    brand: tractors[j].brand,
                    brandCode: tractors[j].brandCode,
                    heading: tractors[j].heading,
                    id: tractors[j].id,
                    model: tractors[j].model,
                    name: tractors[j].name,
                    serialNumber: tractors[j].serialNumber,
                    speed: tractors[j].speed,
                    status: tractors[j].status.name,
                    type: tractors[j].type.code,
                    value: tractors[j].type.code,
                    imgName: this.getimage(tractors[j]),
                    engHours: this.getVehicleDetail('engHours', tractors[j]),
                    fuelLevel: this.getVehicleDetail('fuelLevel', tractors[j]),
                    groundSpeed: this.getVehicleDetail('speed', tractors[j]),
                    statusColor: this.checkStatus(tractors[j].status.name),
                    customstatustypebrand:
                      tractors[j].status.name + tractors[j].type.code + tractors[j].brandCode,
                    brandColor: this.getBrandColor(),
                    vehicleObj: JSON.stringify(tractors[j]),
                    lastUpdate: this.getStatusDate(tractors[j].lastUpdate)
                    // totalAlerts: this.getTotalAlerts(tractors[j].id)
                  }
                });
              }
            }
            if (i === 0) {
              const xmin = data1[0].x;
              const xmax = data1[0].x;
              const ymax = data1[0].y;
              const ymin = data1[0].y;

              let newExtent = new Extent(
                xmin,
                ymin,
                xmax,
                ymax,
                new SpatialReference({ wkid: 4326 })
              );

              for (let i = 0; i < data1.length; i++) {
                // gra = results.features[i];
                const xmini = data1[i].x;
                const xmaxi = data1[i].x;
                const ymaxi = data1[i].y;
                const ymini = data1[i].y;

                const thisExtent = new Extent(
                  xmini,
                  ymini,
                  xmaxi,
                  ymaxi,
                  new SpatialReference({ wkid: 4326 })
                );
                // making a union of extent or previous feature and current feature.
                newExtent = newExtent.union(thisExtent);
              }
              this.mapView.extent = newExtent;
              // if (data1.length > 1) {
              //   this.mapView.zoom = this.mapView.zoom - 0.3;
              // } else {
              //   this.mapView.zoom = 16;
              // }
              // this.mapView.rotation = 0;
            }

            const pointsRenderer = {
              type: 'unique-value', // autocasts as new UniqueValueRenderer()
              field: 'customstatustypebrand',
              valueExpressionTitle: 'Title to display',
              uniqueValueInfos: [
                {
                  value: 'WORKINGTRACTORSCSAG',
                  symbol: this.getUniqueValueSymbol(
                    '/assets/Icon-Vehicle-Cih/CaseTractors/working.png',
                    '#25b03d'
                  )
                },
                {
                  value: 'KEYONTRACTORSCSAG',
                  symbol: this.getUniqueValueSymbol(
                    '/assets/Icon-Vehicle-Cih/CaseTractors/KeyON.png',
                    '#e7a603'
                  )
                },
                {
                  value: 'IDLETRACTORSCSAG',
                  symbol: this.getUniqueValueSymbol(
                    '/assets/Icon-Vehicle-Cih/CaseTractors/Idle.png',
                    '#f47825'
                  )
                },
                {
                  value: 'MOVINGTRACTORSCSAG',
                  symbol: this.getUniqueValueSymbol(
                    '/assets/Icon-Vehicle-Cih/CaseTractors/Moving.png',
                    '#F97C5A'
                  )
                },
                {
                  value: 'TRAVELINGTRACTORSCSAG',
                  symbol: this.getUniqueValueSymbol(
                    '/assets/Icon-Vehicle-Cih/CaseTractors/Traveling.png',
                    '#035db1'
                  )
                },
                {
                  value: 'OFFTRACTORSCSAG',
                  symbol: this.getUniqueValueSymbol(
                    '/assets/Icon-Vehicle-Cih/CaseTractors/Off.png',
                    '#F97C5A'
                  )
                },
                {
                  value: 'WORKINGTRACTORSNHAG',
                  symbol: this.getUniqueValueSymbol(
                    '/assets/Icon-Vehicle-Cih/CaseTractors/working.png',
                    '#25b03d'
                  )
                },
                {
                  value: 'KEYONTRACTORSNHAG',
                  symbol: this.getUniqueValueSymbol(
                    '/assets/Icon-Vehicle-Cih/CaseTractors/KeyON.png',
                    '#e7a603'
                  )
                },
                {
                  value: 'IDLETRACTORSNHAG',
                  symbol: this.getUniqueValueSymbol(
                    '/assets/Icon-Vehicle-Cih/CaseTractors/Idle.png',
                    '#f47825'
                  )
                },
                {
                  value: 'MOVINGTRACTORSNHAG',
                  symbol: this.getUniqueValueSymbol(
                    '/assets/Icon-Vehicle-Cih/CaseTractors/Moving.png',
                    '#F97C5A'
                  )
                },
                {
                  value: 'TRAVELINGTRACTORSNHAG',
                  symbol: this.getUniqueValueSymbol(
                    '/assets/Icon-Vehicle-Cih/CaseTractors/Traveling.png',
                    '#035db1'
                  )
                },
                {
                  value: 'OFFTRACTORSNHAG',
                  symbol: this.getUniqueValueSymbol(
                    '/assets/Icon-Vehicle-Cih/CaseTractors/Off.png',
                    '#F97C5A'
                  )
                }
              ]
            };

            const pointsRendererL = {
              type: 'unique-value', // autocasts as new UniqueValueRenderer()
              field: 'status1',
              valueExpressionTitle: 'Title to display',
              uniqueValueInfos: [
                {
                  value: this.translate.instant('GLOBAL.VEHICLE.STATUS.WORKING'),
                  symbol: {
                    type: 'simple-marker',
                    // autocasts as new SimpleMarkerSymbol()
                    color: '#25b03d'
                  }
                },
                {
                  value: this.translate.instant('GLOBAL.VEHICLE.STATUS.KEYON'),
                  symbol: {
                    type: 'simple-marker',
                    // autocasts as new SimpleMarkerSymbol()
                    color: '#e7a603'
                  }
                },
                {
                  value: this.translate.instant('GLOBAL.VEHICLE.STATUS.IDLE'),
                  symbol: {
                    type: 'simple-marker',
                    // autocasts as new SimpleMarkerSymbol()
                    color: '#f47825'
                  }
                },
                {
                  value: this.translate.instant('GLOBAL.VEHICLE.STATUS.MOVING'),
                  symbol: {
                    type: 'simple-marker',
                    // autocasts as new SimpleMarkerSymbol()
                    color: '#01a8b4'
                  }
                },
                {
                  value: this.translate.instant('GLOBAL.VEHICLE.STATUS.TRAVELING'),
                  symbol: {
                    type: 'simple-marker',
                    // autocasts as new SimpleMarkerSymbol()
                    color: '#035db1'
                  }
                },
                {
                  value: this.translate.instant('GLOBAL.VEHICLE.STATUS.OFF'),
                  symbol: {
                    type: 'simple-marker',
                    // autocasts as new SimpleMarkerSymbol()
                    color: 'grey'
                  }
                }
              ]
            };
            pointsRenderer.valueExpressionTitle = this.translate.instant(
              'PAGE_VEHICLE_DETAILS.STATUS'
            );
            pointsRendererL.valueExpressionTitle = this.translate.instant(
              'PAGE_VEHICLE_DETAILS.STATUS'
            );

            const popup = MapSettings.popupContent;
            if (points) {
              // create graphics
              pointsLayer = new EsriFeatureLayer({
                screenSizePerspectiveEnabled: true,
                source: points, // autocast as an array of esri/Graphic
                // create an instance of esri/layers/support/Field for each field object
                fields: fields, // This is required when creating a layer from Graphics
                objectIdField: 'ObjectID', // This must be defined when creating a layer from Graphics
                renderer: pointsRenderer, // set the visualization on the layer
                // feature reduction is set to selection because our scene contains too many points and they overlap
                outFields: ['*'],
                labelsVisible: true,
                id: 'featureLayerId',
                popupTemplate: popup,
                title: this.translate.instant('PAGE_MAP.LEGEND.LEGEND'),
                legendEnabled: true,
                labelingInfo: [
                  {
                    labelPlacement: 'center-right',
                    labelExpressionInfo: {
                      value: '{name}'
                    },
                    symbol: {
                      type: 'label-3d', // autocasts as new LabelSymbol3D()
                      symbolLayers: [
                        {
                          type: 'text', // autocasts as new TextSymbol3DLayer()
                          material: {
                            color: 'black'
                          },
                          // we set a halo on the font to make the labels more visible with any kind of background
                          halo: {
                            size: 10,
                            color: [255, 255, 255]
                          },
                          size: 10
                        }
                      ]
                    }
                  }
                ],
                geometryType: 'point'
              });
              pointsLayerL = new EsriFeatureLayer({
                screenSizePerspectiveEnabled: true,
                source: pointsL, // autocast as an array of esri/Graphic
                // create an instance of esri/layers/support/Field for each field object
                fields: fields, // This is required when creating a layer from Graphics
                objectIdField: 'ObjectID1', // This must be defined when creating a layer from Graphics
                renderer: pointsRendererL, // set the visualization on the layer
                // feature reduction is set to selection because our scene contains too many points and they overlap
                outFields: ['*'],
                labelsVisible: true,
                id: 'featureLayerId1',
                popupTemplate: popup,
                title: this.translate.instant('PAGE_MAP.LEGEND.LEGEND'),
                legendEnabled: true,
                geometryType: 'point'
              });
              const defaultSym = new SimpleMarkerSymbol({
                size: 10,
                color: '#FF0000',
                outline: null
              });
              const singleRenderer = new UniqueValueRenderer({
                field: 'customstatustypebrand',
                defaultSymbol: defaultSym,
                uniqueValueInfos: MapSettings.uniqueValueInfo
              });

              const renderer = new ClassBreaksRenderer({});
              renderer.field = 'clusterCount';

              const smSymbol = new SimpleMarkerSymbol({
                size: 20,
                outline: new SimpleLineSymbol(
                  SimpleLineSymbol.STYLE_SOLID,
                  new Color([255, 255, 255, 0.7]),
                  10
                ),
                color: [255, 255, 255, 1.0]
              });

              const mdSymbol = new SimpleMarkerSymbol({
                size: 20,
                outline: new SimpleLineSymbol(
                  SimpleLineSymbol.STYLE_SOLID,
                  new Color([255, 255, 255, 0.7]),
                  10
                ),
                color: [255, 255, 255, 1.0]
              });
              // var lgSymbol = new SimpleMarkerSymbol({ size: 50, outline: new SimpleLineSymbol({ color: [41, 163, 41, 0.8] }), color: [51, 204, 51, 0.8] });
              const lgSymbol = new SimpleMarkerSymbol({
                size: 20,
                outline: new SimpleLineSymbol(
                  SimpleLineSymbol.STYLE_SOLID,
                  new Color([255, 255, 255, 0.7]),
                  10
                ),
                color: [255, 255, 255, 1.0]
              });
              const xlSymbol = new SimpleMarkerSymbol({
                size: 60,
                outline: new SimpleLineSymbol({ color: [200, 52, 59, 0.8] }),
                color: [250, 65, 74, 0.8]
              });

              const small = new SimpleMarkerSymbol(
                'circle',
                25,
                new SimpleLineSymbol(
                  SimpleLineSymbol.STYLE_SOLID,
                  new Color([212, 116, 60, 0.5]),
                  15
                ),
                new Color([212, 116, 60, 0.75])
              );
              const medium = new SimpleMarkerSymbol(
                'circle',
                50,
                new SimpleLineSymbol(
                  SimpleLineSymbol.STYLE_SOLID,
                  new Color([178, 70, 37, 0.5]),
                  15
                ),
                new Color([178, 70, 37, 0.75])
              );
              const large = new SimpleMarkerSymbol(
                'circle',
                80,
                new SimpleLineSymbol(
                  SimpleLineSymbol.STYLE_SOLID,
                  new Color([144, 24, 13, 0.5]),
                  15
                ),
                new Color([144, 24, 13, 0.75])
              );
              const xlarge = new SimpleMarkerSymbol(
                'circle',
                110,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([102, 0, 0, 0.5]), 15),
                new Color([102, 0, 0, 0.75])
              );

              renderer.addClassBreakInfo(0, 3, smSymbol);
              renderer.addClassBreakInfo(3, 10, mdSymbol);
              renderer.addClassBreakInfo(10, 100, lgSymbol);
              renderer.addClassBreakInfo(100, Infinity, xlSymbol);

              let areaRenderer;

              // if area display mode is set. Create a renderer to display cluster areas. Use SimpleFillSymbols as the areas are polygons
              const defaultAreaSym = new SimpleFillSymbol({
                style: 'solid',
                color: [0, 0, 0, 0.2],
                outline: new SimpleLineSymbol({ color: [0, 0, 0, 0.3] })
              });

              areaRenderer = new ClassBreaksRenderer({
                defaultSymbol: defaultAreaSym
              });
              areaRenderer.field = 'clusterCount';

              const smAreaSymbol = new SimpleFillSymbol({
                color: [255, 204, 102, 0.4],
                outline: new SimpleLineSymbol({
                  color: [221, 159, 34, 0.8],
                  style: 'dash'
                })
              });
              const mdAreaSymbol = new SimpleFillSymbol({
                color: [102, 204, 255, 0.4],
                outline: new SimpleLineSymbol({
                  color: [82, 163, 204, 0.8],
                  style: 'dash'
                })
              });
              const lgAreaSymbol = new SimpleFillSymbol({
                color: [51, 204, 51, 0.4],
                outline: new SimpleLineSymbol({
                  color: [41, 163, 41, 0.8],
                  style: 'dash'
                })
              });
              const xlAreaSymbol = new SimpleFillSymbol({
                color: [250, 65, 74, 0.4],
                outline: new SimpleLineSymbol({
                  color: [200, 52, 59, 0.8],
                  style: 'dash'
                })
              });

              areaRenderer.addClassBreakInfo(0, 3, smAreaSymbol);
              areaRenderer.addClassBreakInfo(3, 10, mdAreaSymbol);
              areaRenderer.addClassBreakInfo(10, 100, lgAreaSymbol);
              areaRenderer.addClassBreakInfo(100, Infinity, xlAreaSymbol);

              // Set up another class breaks renderer to style the flares individually
              const flareRenderer = new ClassBreaksRenderer({
                defaultSymbol: renderer.defaultSymbol
              });
              flareRenderer.field = 'clusterCount';

              const smFlareSymbol = new SimpleMarkerSymbol({
                size: 15,
                color: [255, 204, 102, 0.8],
                outline: new SimpleLineSymbol({ color: [221, 159, 34, 0.8] })
              });
              const mdFlareSymbol = new SimpleMarkerSymbol({
                size: 15,
                color: [102, 204, 255, 0.8],
                outline: new SimpleLineSymbol({ color: [82, 163, 204, 0.8] })
              });
              const lgFlareSymbol = new SimpleMarkerSymbol({
                size: 15,
                color: [51, 204, 51, 0.8],
                outline: new SimpleLineSymbol({ color: [41, 163, 41, 0.8] })
              });
              const xlFlareSymbol = new SimpleMarkerSymbol({
                size: 15,
                color: [250, 65, 74, 0.8],
                outline: new SimpleLineSymbol({ color: [200, 52, 59, 0.8] })
              });

              flareRenderer.addClassBreakInfo(0, 3, smFlareSymbol);
              flareRenderer.addClassBreakInfo(4, 10, mdFlareSymbol);
              flareRenderer.addClassBreakInfo(11, 100, lgFlareSymbol);
              flareRenderer.addClassBreakInfo(100, Infinity, xlFlareSymbol);

              // set up a popup template
              const popupTemplate = new PopupTemplate({
                title: '{name}',
                content: [
                  {
                    type: 'fields',
                    fieldInfos: [
                      {
                        fieldName: 'type',
                        label: 'Facility Type',
                        visible: true
                      },
                      { fieldName: 'name', label: 'Post Code', visible: true }
                    ]
                  }
                ]
              });

              const options = {
                id: 'flare-cluster-layer',
                clusterRenderer: renderer,
                areaRenderer: areaRenderer,
                // flareRenderer: flareRenderer,
                singleRenderer: singleRenderer,
                singlePopupTemplate: popup,
                spatialReference: new SpatialReference({ wkid: 4326 }),

                clusterRatio: 50,
                clusterAreaDisplay: 'always',
                data: data1,
                zoomOnClick: true,
                // subTypeFlareProperty: "customstatustypebrand",
                subTypeFlareProperty: 'status',
                singleFlareTooltipProperty: 'status',
                // displaySubTypeFlares: true,
                maxSingleFlareCount: maxSingleFlareCount,
                displayFlares: false
              };

              clusterLayer = new fcl.FlareClusterLayer(options);

              clusterLayer.draw(this.map);
              this.map.add(pointsLayerL);
              this.map.add(clusterLayer);
              const zoomcheck = this.mapView.zoom;
              if (zoomcheck > 16) {
                this.mapView.zoom = 14;
              } else {
                this.mapView.zoom = this.mapView.zoom - 0.3;
              }

              clusterLayer.on('draw-complete', function() {
                flagcheck = false;
              });
              clusterLayer.on('click', function() {
                alert('test');
              });
              const doc = document.getElementsByClassName('.esri-search__submit-button');
              const color = this.getBrandColor();
              if (doc.length !== 0) {
                doc[0]['style'].backgroundColor = color;
              }
            }

            const screenPoint = {
              x: 595.6000366210938,
              y: 166
            };

            i++;

            this.mapView.popup.alignment = 'top-right';

            // Get the screen point from the view's click event

            let zoomvar = 3;

            const maxzoom = 16;

            // tslint:disable-next-line:no-shadowed-variable
            watchUtils.watch(this.mapView, 'zoom', function(zoom) {
              zoomvar = zoom;
            });
            const self = this;
            this.mapView.on('click', function(event) {
              setTimeout(() => {
                const elm = document.getElementById('vbut');
                if (elm !== null) {
                  elm.onclick = function() {
                    // tslint:disable-next-line:no-shadowed-variable
                    const evnt = new CustomEvent('CallAngularService');

                    window.dispatchEvent(evnt);
                  };
                }

                const alertelm = document.getElementById('alertbut');
                if (alertelm !== null) {
                  alertelm.onclick = function() {
                    // tslint:disable-next-line:no-shadowed-variable
                    const evnt = new CustomEvent('CallAlertService');

                    window.dispatchEvent(evnt);
                  };
                }

                const evnt = new CustomEvent('CallTotalAlertService');
                window.dispatchEvent(evnt);
              }, 10);

              const screenPoint = {
                x: event.x,
                y: event.y
              };

              // Search for graphics at the clicked location
              self.mapView.hitTest(screenPoint).then(function(response) {
                const result = response.results[0];

                const evt = new CustomEvent('CallHighlightService');

                window.dispatchEvent(evt);
                if (self.mapView.zoom - zoomvar > 4) {
                  self.mapView.goTo({
                    // center: [result.graphic.geometry["longitude"],result.graphic.geometry["latitude"]],
                    center: [result.mapPoint.longitude, result.mapPoint.latitude],
                    zoom: self.mapView.zoom
                  });
                } else {
                  if (zoomvar >= maxzoom) {
                    zoomvar = 17;
                  }
                  self.mapView.goTo({
                    // center: [result.graphic.geometry["longitude"],result.graphic.geometry["latitude"]],
                    center: [result.mapPoint.longitude, result.mapPoint.latitude],
                    zoom: zoomvar + 3
                  });
                }
              });
            });

            const legend = new EsriLegend({
              view: this.mapView,
              layerInfos: [
                {
                  layer: clusterLayer,
                  title: 'NY Educational Attainment'
                }
              ]
            });

            this.mapView.ui.empty('top-left');
            this.mapView.ui.empty('top-right');

            // mapView.ui.add(bgExpand1, 'bottom-left');
            const searchWidget = new EsriSearch({
              view: this.mapView
            });
            searchWidget.watch('visible', function() {
              alert('searchwidgetclick');
            });
            // searchWidget.startup();
            this.mapView.ui.add(searchWidget, 'top-left');

            setTimeout(() => {
              const doc = document.getElementsByClassName('esri-search__submit-button');
              const color = this.getBrandColor();
              if (doc.length !== 0) {
                doc[0]['style'].backgroundColor = color;
              }
            }, 1000);

            const compass = new Compass({
              view: this.mapView
            });

            // adds the compass to the top left corner of the MapView
            this.mapView.ui.add(compass, 'top-left');

            const applicationDiv = document.getElementById('applicationDiv');
            const allowedBasemapTitles = ['Imagery', 'Imagery with Labels', 'Streets'];

            const source = new PortalSource({
              // filtering portal basemaps
              filterFunction: basemap => allowedBasemapTitles.indexOf(basemap.portalItem.title) > -1
            });

            const basemapGallery = new BasemapGallery({ view: this.mapView, source });

            basemapGallery.on('load', function() {
              let basemap,
                basemaps = basemapGallery.basemaps.filter(function(basemap) {
                  return basemap.title === 'Light Gray Canvas';
                });
              if (basemaps && basemaps.length > 0) {
                basemap = basemaps[0];
                basemapGallery.select(basemap.id);
              }
            });

            // Create an Expand instance and set the content
            // property to the DOM node of the basemap gallery widget
            // Use an Esri icon font to represent the content inside
            // of the Expand widget
            const bgExpand = new Expand({
              view: this.mapView,
              content: basemapGallery
            });
            this.mapView.ui.add(bgExpand, 'top-right');
            const zoom = new Zoom({
              view: this.mapView
            });

            this.mapView.ui.add(zoom, 'top-right');

            // close the expand whenever a basemap is selected
            basemapGallery.watch('activeBasemap', function() {});

            const locateBtn = new Locate({
              view: this.mapView
            });
            // Add the expand instance to the ui

            this.mapView.ui.add(locateBtn, 'top-right');

            if (this.layerList) {
              this.layerList.destroy();
            }
            // Add a legend instance to the panel of a
            // ListItem in a LayerList instance
            this.layerList = new LayerList({
              view: this.mapView,
              listItemCreatedFunction: function(event) {
                const item = event.item;
                if (item.layer.type !== 'group') {
                  // don't show legend twice
                  if (item.layer.type === 'graphics') {
                    item.layer.listMode = 'hide';
                    // event.preventDefault();
                  } else {
                    if (item.layer.renderer.field === 'status1') {
                      item.panel = {
                        content: 'legend',
                        open: false
                        // click:alert("test")
                      };
                    } else {
                      item.layer.listMode = 'hide';
                    }
                  }
                } else {
                  item.layer.listMode = 'hide';
                }
              },

              createActionsFunction: this.defineActions
            });
            // this.layerList.destroy();
            // mapView.ui.empty('bottom-left');
            this.mapView.ui.add(this.layerList, 'bottom-left');

            this.mapView.popup.watch('visible', function(evt) {
              setTimeout(() => {
                const elm = document.getElementById('vbut');
                if (elm !== null) {
                  elm.onclick = function() {
                    const event = new CustomEvent('CallAngularService');

                    window.dispatchEvent(event);
                  };
                }

                const alertelm = document.getElementById('alertbut');
                if (alertelm !== null) {
                  alertelm.onclick = function() {
                    const event = new CustomEvent('CallAlertService');

                    window.dispatchEvent(event);
                  };
                }

                if (evt === true) {
                  const event = new CustomEvent('CallTotalAlertService');
                  window.dispatchEvent(event);
                }
              }, 10);
            });
          });
        }
      });

      setTimeout(() => {
        const doc = document.getElementsByClassName('esri-search__submit-button');
        const color = this.getBrandColor();
        if (doc.length !== 0) {
          doc[0]['style'].backgroundColor = color;
        }
      }, 1000);

      this.mapDataLoaded = true;
    } catch (error) {
      alert('We have an error: ' + error);
    }
  }
  toggleRenderer(evt) {
    alert(evt);
  }
  setinnerValues(elname: any, value: any) {
    const doc = document.getElementById(elname);
    if (doc !== null) {
      doc['innerHTML'] = value;
    }
  }
  setbgColor(elname: any, value: any) {
    const doc = document.getElementById(elname);
    if (doc !== null) {
      doc['style'].backgroundColor = value;
    }
  }
  setColor(elname: any, value: any) {
    const doc = document.getElementById(elname);
    if (doc !== null) {
      doc['style'].color = value;
    }
  }
  setImageSrc(elname: any, value: any) {
    const doc = document.getElementById(elname);
    if (doc !== null) {
      doc['src'] = value;
    }
  }
  changePopupContent(veh: any) {
    setTimeout(() => {
      const id = document.getElementById('vId');
      let vehicle = null;
      for (let index = 0; index < this._refData.length; index++) {
        const element = this._refData[index].id;
        if (element === veh.id) {
          vehicle = this._refData[index];
        }
      }
      if (id !== null) {
        document.getElementById('vId')['value'] = vehicle.id;
      }
      this.getTotalAlerts(vehicle.id);
      this.setinnerValues('headerName', vehicle.name);

      this.setinnerValues('lastUpdate', this.getStatusDate(vehicle.lastUpdate));
      this.setinnerValues('bodyName', vehicle.name);
      this.setinnerValues('engHours', this.getVehicleDetail('engHours', vehicle));
      this.setinnerValues('groundSpeed', this.getVehicleDetail('speed', vehicle));
      this.setinnerValues('fuelLevel', this.getVehicleDetail('fuelLevel', vehicle));
      this.setinnerValues(
        'status',
        this.translate.instant('GLOBAL.VEHICLE.STATUS.' + vehicle.status.name)
      );
      this.setbgColor('statusColor', this.checkStatus(vehicle.status.name));
      this.setImageSrc('imgName', this.getimage(vehicle));
      this.setImageSrc('cfvImg', this.isDeviceTypeCFV(vehicle.capabilities));
      this.setColor('status', this.checkStatus(vehicle.status.name));
      const vDetail = vehicle.brand + ' ' + vehicle.model + ' | ' + vehicle.serialNumber;
      this.setinnerValues('vDetail', vDetail);
      const doc = document.getElementById('speedUnit');
      if (doc !== null && this.speedUnit !== 'none') {
        doc['innerHTML'] = ' ' + this.speedUnit;
      } else {
        doc['innerHTML'] = ' ';
      }
    }, 10);

    this.remoteTm(veh.id);
  }
  @HostListener('document:fullscreenchange', []) fullScreen() {
    alert('full screen');
  }
  isDeviceTypeCFV(capabilities): any {
    if (capabilities === {}) {
      return '';
    }
    if (capabilities && capabilities.deviceType.toLowerCase() === 'cfv') {
      return 'assets/climate/climate-fav.png';
    }
    return '';
  }

  @HostListener('window:CallHighlightService')
  onCallHighlightService() {
    setTimeout(() => {
      const id = document.getElementById('vId');
      if (id !== null) {
        const vId = id['value'];
        for (let index = 0; index < this._refData.length; index++) {
          const element = this._refData[index].id;
          if (element === vId) {
          }
        }
      }

      for (let index = 0; index < this._refData.length; index++) {
        const element = this._refData[index].id;
        if (id !== null) {
          if (element === id['value']) {
            if (this.vehicleDetail !== this._refData[index]) {
              this.vehicleDetail = this._refData[index];
            }
          }
        }
      }
      if (id !== null) {
        this.changeRoute(this.vehicleDetail);
        this.showReset = true;
      }
    }, 10);
  }
  @HostListener('window:CallAngularService')
  onCallAngularService() {
    // Run your service call here
    const id = document.getElementById('vId')['value'];
    for (let index = 0; index < this._refData.length; index++) {
      const element = this._refData[index].id;
      if (element === id) {
        const data = this._refData[index];
        this.fleetService._clickedId.next(data.id);
        // this.fleetdata.vehicleToolbarData.firstContent = data.name;
        // this.fleetdata.vehicleToolbarData.secondContent =
        // data.brand + ' ' + data.model + ' | ' + data.serialNumber;
        const vdata = { vehicleData: data };
        this.fleetdata.storage = [];
        this.fleetdata.storage = vdata;

        this._router.navigate(['/fleet/detail/' + vdata.vehicleData.id]);
      }
    }
  }
  @HostListener('window:CallAlertService')
  onCallAlertService() {
    // Run your service call here
    const id = document.getElementById('vId')['value'];
    this._router.navigate(['/fleet/faults/detail/' + id]);
  }
  resetBUttons() {
    const doc = document.getElementById('rmtDiv');
    if (doc !== null) {
      doc.style.display = 'none';
    }
    const docVDiv = document.getElementById('vDiv');
    if (docVDiv !== null) {
      docVDiv.style.width = '100%';
    }
  }
  public remoteTm(id) {
    this.resetBUttons();
    for (let index = 0; index < this._refData.length; index++) {
      const element = this._refData[index].id;
      if (element === id) {
        this.globalVDetail = this._refData[index];
        if (this.displayRDVOption) {
          if (this.globalVDetail.capabilities !== undefined) {
            if (
              this.globalVDetail.capabilities.deviceType !== undefined &&
              this.globalVDetail.capabilities.deviceType === 'PCM'
            ) {
              const docRmt = document.getElementById('rmtDiv');
              if (docRmt !== null) {
                docRmt.style.display = 'block';
                const docVDiv = document.getElementById('vDiv');
                if (docVDiv !== null) {
                  docVDiv.style.width = '50%';
                }

                const rmtSpan = document.getElementById('rmtSpan');
                const rmBut = document.getElementById('remotebut');
                if (this.disableRemoteDisplay === true) {
                  setTimeout(() => {
                    if (rmBut !== null) {
                      rmBut['disabled'] = true;
                      rmBut.style.cursor = 'not-allowed';
                      rmBut.style.backgroundColor = 'lightgrey';
                      rmBut.style.color = 'rgba(0,0,0,.91)';
                    }
                    let statusText = '';
                    if (rmtSpan !== null) {
                      if (this.rdvStatusMsg === 'WAITING') {
                        statusText = this.translate.instant('PAGE_RDV.MESSAGES.WAITING');
                      } else {
                        statusText = this.translate.instant('PAGE_RDV.FULL');
                      }

                      rmtSpan.innerHTML =
                        this.translate.instant('PAGE_RDV.DISPLAY') +
                        '<br /><small>' +
                        statusText +
                        '</small>';
                    }
                  }, 100);
                }
                if (this.disableRemoteDisplay === false) {
                  if (rmtSpan !== null) {
                    setTimeout(() => {
                      rmtSpan.innerHTML = this.translate.instant('PAGE_RDV.DISPLAY');
                      rmBut['disabled'] = false;
                      rmBut.style.cursor = 'pointer';
                      rmBut.style.color = '#fff';
                      rmBut.style.backgroundColor = this.getBrandColor();
                    }, 100);
                  }
                }
              }

              const remotebut = document.getElementById('remotebut');
              if (remotebut !== null) {
                remotebut.onclick = function() {
                  const event = new CustomEvent('CallRemoteService');

                  window.dispatchEvent(event);
                };
              }
            }
          }
        }
      }
    }
  }
  @HostListener('window:CallTotalAlertService')
  onCallTotalAlertService() {
    // Run your service call here
    setTimeout(() => {
      let id = document.getElementById('vId');
      if (id !== null) {
        id = id['value'];

        this.remoteTm(id);
        this.getTotalAlerts(id);
      }
      const doc = document.getElementById('speedUnit');
      if (doc !== null && this.speedUnit !== 'none') {
        doc['innerHTML'] = ' ' + this.speedUnit;
      }
    }, 1000);
  }
  remotedisplaymsg() {
    this._remoteDisplay.enableRemoteDisplayView$.subscribe(data => {
      if (data) {
        if (data.enable) {
          this.rdvStatusMsg = data.socketResponse.connectionStatus;
          const rmtSpan = document.getElementById('rmtSpan');
          const rmBut = document.getElementById('remotebut');
          let statusText = '';
          //  window.alert(this.rdvStatusMsg);
          if (this.rdvStatusMsg === 'FAILED') {
            if (this.disableRemoteDisplay === true) {
              setTimeout(() => {
                if (rmtSpan !== null) {
                  statusText = this.translate.instant('PAGE_RDV.FULL');
                  rmtSpan.innerHTML =
                    this.translate.instant('PAGE_RDV.DISPLAY') +
                    '<br /><small>' +
                    statusText +
                    '</small>';
                }
              }, 100);
            }
          } else if (this.rdvStatusMsg === 'WAITING') {
            if (this.disableRemoteDisplay === true) {
              setTimeout(() => {
                if (rmtSpan !== null) {
                  statusText = this.translate.instant('PAGE_RDV.MESSAGES.WAITING');
                  rmtSpan.innerHTML =
                    this.translate.instant('PAGE_RDV.DISPLAY') +
                    '<br /><small>' +
                    statusText +
                    '</small>';
                }
              }, 100);
            }
          } else if (this.rdvStatusMsg === 'RUNNING') {
            if (this.disableRemoteDisplay === true) {
              setTimeout(() => {
                if (rmtSpan !== null) {
                  statusText = this.translate.instant('PAGE_RDV.FULL');
                  rmtSpan.innerHTML =
                    this.translate.instant('PAGE_RDV.DISPLAY') +
                    '<br /><small>' +
                    statusText +
                    '</small>';
                }
              }, 100);
            }
          }
        }
      }
    });
  }

  @HostListener('window:CallRemoteService')
  CallRemoteService() {
    this._remoteDisplay.launchTeamviewer(this.globalVDetail.id, this.globalVDetail.name);

    this._rdvInitiatedSubscription = this._remoteDisplay.rdvInitiated$.subscribe(initiated => {
      if (initiated) {
        this.disableRemoteDisplay = true;
      } else {
        this.disableRemoteDisplay = false;
      }

      this.remoteTm(this.globalVDetail.id);
    });

    this.remotedisplaymsg();
  }

  @HostListener('window:CallCloseService')
  onCallCloseService() {
    alert('test');
  }
  getimage(vehicle: any): any {
    return this.utilService.getImageUrl(vehicle);
  }

  getStatusDate(date: any): any {
    const sDate = new Date(date);
    const statusDate = this.datepipe.transform(sDate, 'MM/dd/yyyy');
    const cDate = new Date();
    const currDate = this.datepipe.transform(cDate, 'MM/dd/yyyy');
    if (statusDate === currDate) {
      return moment(sDate.getTime()).format('hh:mm A');
    }
    return statusDate;
  }

  calulateHeight() {
    if (this.userService.getBrand() === BrandNames.CIH) {
      return this.filtersBarOpen
        ? window.innerHeight - 215 + 'px'
        : window.innerHeight - 170 + 'px';
    } else {
      return this.filtersBarOpen
        ? window.innerHeight - 255 + 'px'
        : window.innerHeight - 210 + 'px';
    }
  }

  getVehicleDetail(name: any, arr: any): any {
    let response: any = this.translate.instant('GLOBAL.NO_DATA');

    if (name === 'engHours') {
      if (arr.parameters === undefined) {
        return 'N/A';
      } else {
        arr.parameters.forEach(element => {
          if (element.code === 'ENG_HOURS') {
            response = Math.round(element.value * 100) / 100 + '' + element.unit;
          }
        });
      }
    } else if (name === 'fuelLevel') {
      if (arr.parameters === undefined) {
        return 'N/A';
      } else {
        arr.parameters.forEach(element => {
          if (element.code === 'FUEL_LEVEL') {
            response = Math.round(element.value * 100) / 100 + ' ' + element.unit;
          }
        });
      }
    } else if (name === 'speed') {
      if (arr.parameters === undefined) {
        this.speedUnit = 'none';
        return 'N/A';
      } else {
        arr.parameters.forEach(element => {
          if (element.code === 'GROUND_SPEED') {
            const res = this.getSpeedBasedOnStatus(arr.status.name);
            if (res === 'nomatch') {
              response = Math.round(element.value * 100) / 100;
              this.speedUnit = element.unit;
            } else {
              response = res;
              this.speedUnit = 'none';
            }
          }
        });
      }
      if (response === 'N/A') {
        this.speedUnit = 'none';
      }
    }
    return response;
  }

  getSpeedBasedOnStatus(status: any): any {
    let response: any = 'nomatch';
    switch (status.toLowerCase()) {
      case 'off':
        response = '--';
        break;
      case 'keyon':
        response = '--';
        break;

      case 'idle':
        response = '0';
        break;
      default:
        break;
    }
    return response;
  }
  // Function that automatically creates the symbol for the points of interest
  getUniqueValueSymbol(name, color) {
    const verticalOffset = {
      screenLength: 40,
      maxWorldLength: 200,
      minWorldLength: 35
    };
    // The point symbol is visualized with an icon symbol. To clearly see the location of the point
    // we displace the icon vertically and add a callout line. The line connects the offseted symbol with the location
    // of the point feature.
    return {
      type: 'point-3d', // autocasts as new PointSymbol3D()
      symbolLayers: [
        {
          type: 'icon', // autocasts as new IconSymbol3DLayer()
          resource: {
            href: name
          },
          outline: {
            color: [0, 0, 0, 255],
            width: 1,
            type: 'esriSLS',
            style: 'esriSLSSolid'
          },
          size: 50
        }
      ],

      verticalOffset: verticalOffset
    };
  }
  checkStatus(status) {
    switch (status) {
      case 'KEYON':
        return '#e7a603';
      case 'OFF':
        return 'grey';
      case 'WORKING':
        return '#25b03d';
      case 'MOVING':
        return '#01a8b4';
      case 'Keyon':
        return '#e7a603';
      case 'IDLE':
        return '#f47825';
      case 'TRAVELING':
        return '#035db1';
      default:
        return 'black';
    }
  }

  getBrandColor() {
    switch (this.userService.getBrand()) {
      case BrandNames.CIH:
        return BrandColors.CIH;

      case BrandNames.NH:
        return BrandColors.NH;

      default:
        break;
    }
  }

  getTotalAlerts(id) {
    this.fleetFilterDataStore.filteredUnitsData$.subscribe(fData => {
      fData.forEach(element => {
        if (element.id === id) {
          const doc = document.getElementById('totalAlerts');

          const count = element.statusALERTS;
          if (count > 0) {
            this.result =
              '<img class="severity-img" src="./assets/svg/high.svg" /><b style="color:black;font-weight: 700;">' +
              count +
              '</b> ' +
              '<span>' +
              this.translate.instant('PAGE_MAIN.ALERTS.HIGH_FAULTS') +
              '</span>';
            if (doc !== null) {
              doc.innerHTML = this.result;
            }
          } else {
            if (doc !== null) {
              doc.innerHTML = this.translate.instant('PAGE_MAIN.ALERTS.NO_ACTIVE_ALERTS');
            }
          }
        }
      });
    });
  }
  ngOnDestroy() {
    this._rdvInitiatedSubscription.unsubscribe();
  }
  ngOnInit() {
    // window.alert('test2');
    this.remotedisplaymsg();
    this._rdvInitiatedSubscription = this._remoteDisplay.rdvInitiated$.subscribe(initiated => {
      if (initiated) {
        this.disableRemoteDisplay = true;
      } else {
        this.disableRemoteDisplay = false;
      }
    });

    if (this._appSettings.rdvSettings.enableRdv) {
      this.displayRDVOption = true;
    } else {
      this.displayRDVOption = false;
    }
    this.mapDataLoaded = true;

    this.mapData();
    this.totalMapheight = this.calulateHeight();
    if (this._zoom === 3) {
    } else {
      // this.initializeMap();
    }
    const dojoConfig = {
      has: {
        'esri-featurelayer-webgl': 1
      }
    };
  }

  mapData() {
    this.fleetType = this.fleetService.getFleetType();
    this.filterValue = this.fleetService.getFilterValue();
    this.fleetService.fleetType$.subscribe(data => {
      if (data !== null) {
        this.fleetType = data;

        this.vehicleDataLoaded = this._fleetfilterStore.vehicleDataLoaded;
      }
    });

    this.fleetService.vehicleType$.subscribe(data => {
      if (data !== null) {
        this.vehicleType = data;

        this.vehicleDataLoaded = this._fleetfilterStore.vehicleDataLoaded;
      }
    });

    this.fleetService.fleetTypeCollapse$.subscribe(data => {
      this.fleetTypeCollapse = data;
    });

    this.collapse = this.fleetService.getCollapseValue();

    this.fleetTypeCollapse = this.fleetService.getFleetTypeCollapse();

    this.vehicleTypeCollapse = this.fleetService.getVehicleTypeCollapse();
    this.filterOptions = this.fleetService.getFilterOptions();
    this.titleValue = this.fleetService.getTitleValue();
  }
  exportID(vehicle) {
    this.vehicleId.emit(vehicle.id);
  }

  changeRoute(vehicle) {
    if (vehicle.isDisconnected) {
      return;
    }
    this.showReset = true;
    this.resetHighList();
    this.fleetService._clickedId.next(vehicle.id);
    this.navMapService.mapFirstLoad = false;
    (this.mapView as any).goTo({
      center: [vehicle.location[1], vehicle.location[0]],
      zoom: 16
    });

    // alert('test1');
    const divScrollElement = this.panel.nativeElement.querySelector('.ps__rail-y').attributes.style;
    const scrollCurrentTopPosition = divScrollElement.value
      .split(';')[0]
      .substring(4, divScrollElement.value.split(';')[0].length - 2);
    localStorage.setItem('scrollTop', scrollCurrentTopPosition);

    vehicle['imageUrl'] = this.utilService.getImageUrl(vehicle);
    const id = vehicle.id;
    const name = vehicle.name;

    this.fleetService.vId = id;
    this.fleetService.vName = name;

    const currentRoute = this._location
      .path()
      .substring(1)
      .split('/')[1];
    this.fleetdata.vehicleDetail = null;
    //  this.fleetdata.vehicleId = vehicle;
    setTimeout(() => {
      this.fleetdata.showMapVehicleInfo = true;
      this.mapData();
      //  this.selectedVehicleService.updateSelectedVehicle(this.fleetdata.vehicleId);
      const doc = document.getElementById('main-div');
      if (doc !== null) {
        this.changePopupContent(vehicle);
      }
    }, 10);
  }

  resetRoute() {
    this.clickedId = '';

    this.fleetService._clickedId.next(0);
    this.fleetService._elementCount.next(0);

    const currentRoute = this._location
      .path()
      .substring(1)
      .split('/')[1];

    const doc = document.getElementsByClassName('list-active');

    this.fleetdata.vehicleDetail = null;
    this.fleetdata.vehicleId = null;
    if (this._router.url === '/fleet/overview/map') {
      this.fleetdata.showMapVehicleInfo = false;
    } else {
      // this._router.navigate(['/fleet/service']);
    }
    this.resetHighList();
  }

  resetHighList() {
    const doc = document.getElementsByClassName('list-active');

    if (doc.length !== 0) {
      doc[0].classList.remove('list-active');
    }
  }
  updateCollapseValue(collapse) {
    this.fleetService.setCollapseValue(collapse);
  }

  updateFilterValue(filterValue) {
    this.fleetService.setFilterValue(filterValue);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    setTimeout(() => {
      this.navMapService.selectedOption = 'map';

      if (this.directiveScroll !== undefined) {
        this.directiveScroll.directiveRef.scrollToElement('.list-active');
        const item = localStorage.getItem('scrollTop');
        if (typeof item !== 'undefined') {
          this.directiveScroll.directiveRef.scrollToTop(+item);
          localStorage.setItem('scrollTop', '0');
        } else {
          this.directiveScroll.directiveRef.scrollToTop();
        }
      }
    }, 10);
  }

  valuechange(_event, item) {
    this.fleetService.setFilterValue(_event.id);
    this.filterValue = _event.id;
  }
  navOverview() {
    this._router.navigate(['/fleet/overview']);
  }
}
