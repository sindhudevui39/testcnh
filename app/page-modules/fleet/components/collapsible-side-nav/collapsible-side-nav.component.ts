import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { TranslateService } from '@ngx-translate/core';

import { FleetDataService } from '@fleet/services/fleet-data.service';
import { FleetFilterDataStoreService } from '@fleet/services/fleet-filter-data-store/fleet-filter-data-store.service';
import { FleetService } from '../../services/fleet.service';
import { NavmapService } from '@fleet/services/navmap.service';
import { SelectedVehicleService } from '@fleet/services/events/selected-vehicle.service';
import { ToolbarToggleFilterbarService } from '@fleet/services/events/toolbar-toggle-filterbar.service';
import { UserService } from '@services/user/user.service';
import { UtilService } from '@services/util/util.service';

import { BrandNames } from '@enums/brand.enum';

@Component({
  selector: 'app-collapsible-side-nav',
  templateUrl: './collapsible-side-nav.component.html',
  styleUrls: ['./collapsible-side-nav.component.css'],
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
export class CollapsibleSideNavComponent implements OnInit {
  @ViewChild(PerfectScrollbarComponent)
  public directiveScroll: PerfectScrollbarComponent;

  @ViewChild('listPS', { read: ElementRef })
  public panel: ElementRef<any>;
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
  filtersBarOpen: boolean;

  public displayClearSelection = true;

  clickedId;
  showLoader = true;
  sctollTopPosition = 0;
  displayNoVehicleText: boolean;
  constructor(
    private _location: Location,
    private _router: Router,
    private fleetService: FleetService,
    public fleetdata: FleetDataService,
    private selectedVehicleService: SelectedVehicleService,
    private _fleetfilterStore: FleetFilterDataStoreService,
    private _toggleFilterBarService: ToolbarToggleFilterbarService,
    private utilService: UtilService,
    public userService: UserService,
    private navMapService: NavmapService,
    private router: Router,
    private translateService: TranslateService
  ) {
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

    this._toggleFilterBarService.openFiltersBar$.subscribe(value => {
      this.filtersBarOpen = value;
    });
  }

  ngOnInit() {
    this._fleetfilterStore.filteredUnitsData$.subscribe(data => {
      this.vehicleDataLoaded = this._fleetfilterStore.vehicleDataLoaded;

      if (data && data.length === 0 && this.vehicleDataLoaded) {
        this.displayNoVehicleText = true;
      } else {
        this.displayNoVehicleText = false;
      }
    });

    if (this.router.url.split('/')[3] && this.router.url.split('/')[3] === 'detail') {
      this.showReset = true;
    }
    if (this.router.url === '/fleet/vehicalInfo') {
      setTimeout(() => {
        this.showReset = true;
      }, 10);
    }

    this.fleetType = this.fleetService.getFleetType();
    this.filterValue = this.fleetService.getFilterValue();

    this.fleetService.fleetType$.subscribe(data => {
      if (data !== null) {
        this.fleetType = data;
      }
    });

    this.fleetService.vehicleType$.subscribe(data => {
      if (data !== null) {
        this.vehicleType = data;
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
    const divScrollElement = this.panel.nativeElement.querySelector('.ps__rail-y').attributes.style;
    const scrollCurrentTopPosition = divScrollElement.value
      .split(';')[0]
      .substring(4, divScrollElement.value.split(';')[0].length - 2);
    localStorage.setItem('scrollTop', scrollCurrentTopPosition);
    //  this.fleetdata.vehicleId = vehicle;
    vehicle['imageUrl'] = this.utilService.getImageUrl(vehicle);
    const id = vehicle.id;
    const name = vehicle.name;

    this.fleetService.vId = id;
    this.fleetService.vName = name;

    // this.selectedVehicleService.updateSelectedVehicle(vehicle);

    const currentRoute = this._location
      .path()
      .substring(1)
      .split('/')[1];
    this.fleetService._clickedId.next(vehicle.id);

    if (currentRoute === 'faults') {
      //  this.fleetdata.vehicleId.id = id;

      this._router.navigate(['/fleet/faults/detail/' + id]);
    } else if (this._router.url.includes('/fleet/detail/')) {
      this.displayClearSelection = true;
      this.navMapService.showMap = false;
      const data = { vehicleData: vehicle };
      this.fleetdata.storage = [];
      this.fleetdata.storage = data;

      this._router.navigate(['/fleet/detail/' + vehicle.id]);
    }
  }

  resetRoute() {
    this.clickedId = '';

    this.fleetService._clickedId.next(0);
    this.fleetService._elementCount.next(0);

    const currentRoute = this._location
      .path()
      .substring(1)
      .split('/')[1];

    this.fleetService.vName = this.updatedCount + ' Fleets';
    this.fleetService.vId = this.updatedVCount + ' Vehicles';

    const doc = document.getElementsByClassName('list-active');

    this.fleetdata.vehicleDetail = null;
    this.fleetdata.vehicleId = null;

    if (doc.length !== 0) {
      doc[0].classList.remove('list-active');
    }
    if (currentRoute === 'faults') {
      this._router.navigate(['/fleet/faults/overview']);
    } else if (this._router.url.includes('/fleet/detail/')) {
      this._router.navigate(['/fleet/overview']);
    } else if (this._router.url === '/fleet/overview/map') {
      this.fleetdata.showMapVehicleInfo = false;
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
  }

  valuechange(_event) {
    this.fleetService.setFilterValue(_event.id);

    this.filterValue = _event.id;
  }

  navOverview() {
    this._router.navigate(['/fleet/overview']);
  }
}
