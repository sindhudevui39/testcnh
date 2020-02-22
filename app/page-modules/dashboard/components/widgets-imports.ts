import { DbAreaCoveredComponent } from '@dashboard/components/widgets/db-area-covered/db-area-covered.component';
import { DbDailyFuelComponent } from '@dashboard/components/widgets/db-daily-fuel/db-daily-fuel.component';
import { DbFaultsComponent } from '@dashboard/components/widgets/db-faults/db-faults.component';
import { DbLowFuelComponent } from '@dashboard/components/widgets/db-low-fuel/db-low-fuel.component';
import { DbTotalFuelComponent } from '@dashboard/components/widgets/db-total-fuel/db-total-fuel.component';
import { DbVehicleSatusComponent } from '@dashboard/components/widgets/db-vehicle-satus/db-vehicle-satus.component';

export const dashboardWidgets = [
  DbAreaCoveredComponent,
  DbDailyFuelComponent,
  DbFaultsComponent,
  DbLowFuelComponent,
  DbTotalFuelComponent,
  DbVehicleSatusComponent
];

export const entryComponentWidgets = [...dashboardWidgets];
