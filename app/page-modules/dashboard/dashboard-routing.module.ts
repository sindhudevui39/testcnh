import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DbHomeComponent } from '@dashboard/pages/db-home/db-home.component';

const routes: Routes = [
  {
    path: '',
    component: DbHomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
