import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FleetRoutingModule } from './fleet-routing.module';

import { FleetOverviewComponent } from './pages/fleet-overview/fleet-overview.component';
import { FleetFaultsComponent } from './pages/fleet-faults/fleet-faults.component';
import { FleetFaultListComponent } from './components/fleet-fault-list/fleet-fault-list.component';
import { FleetVehicleListComponent } from './components/fleet-vehicle-list/fleet-vehicle-list.component';
import { CollapsibleSideNavComponent } from './components/collapsible-side-nav/collapsible-side-nav.component';
import { FleetServiceComponent } from './pages/fleet-service/fleet-service.component';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomMaterialModule } from '@shared-modules/custom-material/custom-material.module';
import { FleetHistoryDialogComponent } from './components/fleet-history-dialog/fleet-history-dialog.component';
import { MatSidenavModule } from '@angular/material';

import { SharedModule } from 'src/app/shared/shared.module';
import { FleetComponent } from './fleet.component';
import { FleetToolbarComponent } from './components/fleet-toolbar/fleet-toolbar.component';
import { VehicleCustomizationComponent } from './pages/fleet-overview/vehicle-customization-modal/vehicle-customization-component';
import { NoCommaPipe } from './pages/fleet-overview/no-comma.pipe';
import { FleetFaultDetailsComponent } from './components/fleet-fault-details/fleet-fault-details.component';
import { FleetFaultOverviewComponent } from './components/fleet-fault-overview/fleet-fault-overview.component';
import { FleetDataService } from '@fleet/services/fleet-data.service';
import { FleetToolbarDisplayInfoComponent } from './components/fleet-toolbar/fleet-toolbar-display-info/fleet-toolbar-display-info.component';
import { FleetMapComponent } from './pages/fleet-map/fleet-map.component';
import { NavmapService } from './services/navmap.service';
import { SearchHighlightPipe } from './pipes/search-highlight.pipe';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SnackBarComponent } from '@shared-components/snack-bar/snack-bar.component';
import { FaultsListHeaderComponent } from './pages/fleet-faults/components/faults-list-header/faults-list-header.component';
import { HistoryDialogHeaderComponent } from './components/fleet-history-dialog/history-dialog-header/history-dialog-header.component';
import { fleetNotificationsEntryComponents } from './pages/fleet-notifications/fleet-notifications-entry-component-imports';
import { FleetOverviewListHeaderComponent } from './pages/fleet-overview/components/fleet-overview-list-header/fleet-overview-list-header.component';
import { FleetOverviewListItemComponent } from './pages/fleet-overview/components/fleet-overview-list-item/fleet-overview-list-item.component';
import { FleetDetailComponent } from './pages/fleet-detail/fleet-detail.component';
import { FleetVehicleInfoComponent } from './pages/fleet-detail/components/fleet-vehicle-info/fleet-vehicle-info.component';
import { FleetDutyReportComponent } from './pages/fleet-detail/components/fleet-duty-report/fleet-duty-report.component';
import { FleetFuelReportComponent } from './pages/fleet-detail/components/fleet-fuel-report/fleet-fuel-report.component';
import { ChartsModule } from 'ng2-charts';
import { fleetFirmwareComponents } from './pages/fleet-firmware/fleet-firmware-imports';
import { fleetFirmwareEntryComponents } from './pages/fleet-firmware/fleet-firmware-entry-component-imports';
import { FleetFilterBarComponent } from './components/fleet-toolbar/filters/fleet-filter-bar/fleet-filter-bar.component';
import { FaultFilterBarComponent } from './components/fleet-toolbar/filters/fault-filter-bar/fault-filter-bar.component';
import { FleetCandataParameterComponent } from './components/fleet-candata-parameter/fleet-candata-parameter.component';
import { fleetNotificationsComponents } from './pages/fleet-notifications/fleet-notifications-imports';

export function fleetEntryPoint() {
  return FleetModule;
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/fleet/', '.json');
}

@NgModule({
  imports: [
    CommonModule,
    FleetRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      isolate: true
    }),
    ChartsModule
  ],
  declarations: [
    FleetComponent,
    FleetOverviewComponent,
    FleetFaultsComponent,
    FleetFaultListComponent,
    FleetVehicleListComponent,
    CollapsibleSideNavComponent,
    FleetServiceComponent,
    FleetFaultDetailsComponent,
    FleetHistoryDialogComponent,
    FleetComponent,
    FleetToolbarComponent,
    FleetFaultsComponent,
    VehicleCustomizationComponent,
    NoCommaPipe,
    FleetFilterBarComponent,
    FleetFaultOverviewComponent,
    FleetToolbarDisplayInfoComponent,
    FleetMapComponent,
    SearchHighlightPipe,
    SnackBarComponent,
    FaultFilterBarComponent,
    FaultsListHeaderComponent,
    HistoryDialogHeaderComponent,
    ...fleetNotificationsComponents,
    ...fleetFirmwareComponents,
    FleetOverviewListItemComponent,
    FleetOverviewListHeaderComponent,

    FleetDetailComponent,
    FleetVehicleInfoComponent,
    FleetDutyReportComponent,
    FleetFuelReportComponent,
    FleetCandataParameterComponent
  ],
  entryComponents: [
    VehicleCustomizationComponent,
    FleetHistoryDialogComponent,
    SnackBarComponent,
    ...fleetNotificationsEntryComponents,
    ...fleetFirmwareEntryComponents
  ],
  exports: [CommonModule, MatSidenavModule],
  providers: [FleetDataService, NavmapService]
})
export class FleetModule {}
