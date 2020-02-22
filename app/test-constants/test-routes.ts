import { Routes } from '@angular/router';
import { FleetManageComponent } from '@fleet/pages/fleet-notifications/fleet-manage/fleet-manage.component';
import { FleetHistoryComponent } from '@fleet/pages/fleet-notifications/fleet-history/fleet-history.component';

export const testRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: FleetManageComponent
      },
      {
        path: 'history',
        component: FleetHistoryComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
