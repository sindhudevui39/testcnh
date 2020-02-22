import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanDeactivateGuard } from 'src/app/core/guards/can-deactivate.guard';

import { FleetFaultsComponent } from './pages/fleet-faults/fleet-faults.component';
import { FleetComponent } from './fleet.component';
import { FleetNotificationsComponent } from './pages/fleet-notifications/fleet-notifications.component';
import { FleetOverviewComponent } from './pages/fleet-overview/fleet-overview.component';
import { FleetMapComponent } from './pages/fleet-map/fleet-map.component';
import { FleetFaultOverviewComponent } from './components/fleet-fault-overview/fleet-fault-overview.component';
import { FleetFaultListComponent } from './components/fleet-fault-list/fleet-fault-list.component';
import { FleetManageComponent } from './pages/fleet-notifications/fleet-manage/fleet-manage.component';
import { FleetHistoryComponent } from './pages/fleet-notifications/fleet-history/fleet-history.component';
import { FleetDetailComponent } from './pages/fleet-detail/fleet-detail.component';

const routes: Routes = [
  {
    path: '',
    component: FleetComponent,
    canDeactivate: [CanDeactivateGuard],
    children: [
      { path: '', redirectTo: 'overview' },
      {
        path: 'overview',
        component: FleetOverviewComponent
      },
      {
        path: 'detail/:vehicleId',
        component: FleetDetailComponent
      },
      {
        path: 'overview/map',
        component: FleetMapComponent
      },
      {
        path: 'faults',
        component: FleetFaultsComponent,
        children: [
          { path: '', redirectTo: 'overview' },
          {
            path: 'overview',
            component: FleetFaultOverviewComponent
          },
          {
            path: 'detail/:vehicleId',
            component: FleetFaultListComponent
          }
        ]
      },
      {
        path: 'notifications',
        component: FleetNotificationsComponent,
        children: [
          { path: '', redirectTo: 'manage' },
          {
            path: 'manage',
            component: FleetManageComponent
          },
          {
            path: 'history',
            component: FleetHistoryComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FleetRoutingModule {}
