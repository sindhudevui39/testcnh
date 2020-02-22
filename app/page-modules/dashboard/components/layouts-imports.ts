import { DbAddWidgetBtnComponent } from '@dashboard/components/layouts/db-add-widget-btn/db-add-widget-btn.component';
import { DbAddWidgetDialogComponent } from '@dashboard/components/layouts/db-add-widget-dialog/db-add-widget-dialog.component';
import { DbFaultItemComponent } from '@dashboard/components/layouts/db-fault-item/db-fault-item.component';
import { DbVehicleItemComponent } from '@dashboard/components/layouts/db-vehicle-item/db-vehicle-item.component';
import { DbWidgetHeaderComponent } from '@dashboard/components/layouts/db-widget-header/db-widget-header.component';
import { DbWidgetMenuComponent } from '@dashboard/components/layouts/db-widget-menu/db-widget-menu.component';

export const dashboardLayouts = [
  DbAddWidgetBtnComponent,
  DbAddWidgetDialogComponent,
  DbFaultItemComponent,
  DbVehicleItemComponent,
  DbWidgetHeaderComponent,
  DbWidgetMenuComponent
];

export const entryComponentLayouts = [DbAddWidgetBtnComponent, DbAddWidgetDialogComponent];
