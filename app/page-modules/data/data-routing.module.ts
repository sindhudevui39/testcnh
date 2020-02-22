import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InboxComponent } from './pages/inbox/inbox.component';
import { DataAccessComponent } from './pages/data-access/data-access.component';
import { Connections } from './pages/Connections/connections.component';

import { CnhPagePartnerDataAccessComponent } from './pages/data-access/components/cnh-page-partner-data-access/cnh-page-partner-data-access.component';
import { CnhPageMyDataAccessComponent } from './pages/data-access/components/cnh-page-my-data-access/cnh-page-my-data-access.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inbox',
    pathMatch: 'full'
  },
  {
    path: 'inbox',
    component: InboxComponent
  },
  {
    path: 'data-access',
    component: DataAccessComponent,
    children: [
      {
        path: 'partner-data',
        component: CnhPagePartnerDataAccessComponent
      },
      {
        path: 'partner-data',
        children: [
          {
            path: ':partnerId',
            component: CnhPagePartnerDataAccessComponent
          }
        ]
      },
      {
        path: 'my-data',
        component: CnhPageMyDataAccessComponent
      },
      {
        path: 'my-data',
        children: [
          {
            path: ':partnerId',
            component: CnhPageMyDataAccessComponent
          }
        ]
      }
    ]
  },
  {
    path: 'connections',
    component: Connections
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataRoutingModule {}
