import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';

import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardRoutingModule } from '@dashboard/dashboard-routing.module';

import { DashboardService } from '@dashboard/services/dashboard/dashboard.service';

import { DbHomeComponent } from '@dashboard/pages/db-home/db-home.component';

import { dashboardWidgets, entryComponentWidgets } from '@dashboard/components/widgets-imports';
import { dashboardLayouts, entryComponentLayouts } from '@dashboard/components/layouts-imports';

@NgModule({
  imports: [CommonModule, ChartsModule, DashboardRoutingModule, SharedModule],
  declarations: [DbHomeComponent, ...dashboardWidgets, ...dashboardLayouts],
  providers: [DashboardService],
  entryComponents: [...entryComponentWidgets, ...entryComponentLayouts]
})
export class DashboardModule {}
