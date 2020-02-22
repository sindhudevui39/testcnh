import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { DataRoutingModule } from './data-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Connections } from './pages/Connections/connections.component';

import { DataAccessComponent } from './pages/data-access/data-access.component';
import { InboxComponent } from './pages/inbox/inbox.component';
import { CnhShareFieldSummaryComponent } from './pages/data-access/components/cnh-share-field-summary/cnh-share-field-summary.component';
import { CnhSearchComponent } from './pages/inbox/components/cnh-search/cnh-search.component';
import { CnhInboxListComponent } from './pages/inbox/layouts/cnh-inbox-list/cnh-inbox-list.component';
import { CnhInboxSorterComponent } from './pages/inbox/components/cnh-inbox-sorter/cnh-inbox-sorter.component';
import { CustomMaterialModule } from '../../shared/modules/custom-material/custom-material.module';
import { CnhPageMyDataAccessComponent } from './pages/data-access/components/cnh-page-my-data-access/cnh-page-my-data-access.component';
import { CnhPagePartnerDataAccessComponent } from './pages/data-access/components/cnh-page-partner-data-access/cnh-page-partner-data-access.component';

import { CnhSortableItemComponent } from './pages/inbox/components/cnh-sortable-item/cnh-sortable-item.component';
import { CnhCollapsibleComponent } from './pages/inbox/components/cnh-collapsible/cnh-collapsible.component';
import { GroupByPipe } from './pages/inbox/pipe/group-by.pipe';
import { CnhHighlightPipe } from './pages/inbox/pipe/cnh-highlights-pipe';

import { CnhModalInviteComponent } from './pages/data-access/components/cnh-modal-invite/cnh-modal-invite.component';
import { CnhTrowserDataSharingComponent } from './pages/data-access/layouts/cnh-trowser-data-sharing/cnh-trowser-data-sharing.component';
import 'simplebar';
import { MomentLocaleService } from './pages/inbox/services/moment-locale.service';
import { DataFilesFilterService } from './pages/inbox/services/data-files-filters.service';
import { DataFileStore } from './pages/inbox/services/data-file.store';
import { DataFileService } from './pages/inbox/services/data-file.service';
import { GlobalSortingService } from './pages/inbox/services/global-sorting-service';
import { DateTimeSettingsService } from './pages/inbox/services/date-time-settings.service';
import { DataClientsService } from './pages/Connections/services/data.service';
import { DataAccessClientsService } from './pages/data-access/services/data-access.services';
import { CnhSnackBarService } from './pages/data-access/services/cnh-snack-bar.service';
import { CnhModalComponent } from './pages/Connections/components/cnh-modal/cnh-modal.component';
import { CnhTrowserComponent } from './pages/data-access/layouts/data-access-setup/data-access-setup';
import { CnhTrowserService } from './pages/data-access/services/data-access-setup-service';
import { CnhFieldsSelectionWidgetComponent } from './pages/data-access/layouts/cnh-fields-selection-widget/cnh-fields-selection-widget.component';
import { CnhAdvancedSelectComponent } from './pages/data-access/components/cnh-advanced-select/cnh-advanced-select.component';
import { CnhOperationsSelectionWidgetComponent } from './pages/data-access/layouts/cnh-operations-selection-widget/cnh-operations-selection-widget.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RequestInterceptor } from 'src/app/http-interceptor';
import { InboxSetupdataDialogComponent } from './pages/inbox/components/inbox-setupdata-dialog/inbox-setupdata-dialog.component';
export function dataEntryPoint() {
  return DataModule;
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/data/', '.json');
}

@NgModule({
  declarations: [
    DataAccessComponent,
    Connections,
    InboxComponent,
    GroupByPipe,
    CnhHighlightPipe,
    CnhSearchComponent,
    CnhInboxListComponent,
    CnhPageMyDataAccessComponent,
    CnhPagePartnerDataAccessComponent,
    CnhInboxSorterComponent,
    CnhSortableItemComponent,
    CnhCollapsibleComponent,
    CnhModalInviteComponent,
    CnhModalComponent,
    CnhShareFieldSummaryComponent,
    CnhTrowserComponent,
    CnhTrowserDataSharingComponent,
    CnhFieldsSelectionWidgetComponent,
    CnhAdvancedSelectComponent,
    CnhOperationsSelectionWidgetComponent,
    InboxComponent,
    DataAccessComponent,
    Connections,
    InboxSetupdataDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DataRoutingModule,
    HttpClientModule,
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
    })
  ],
  providers: [
    MomentLocaleService,
    DataFilesFilterService,
    DataFileStore,
    DataFileService,
    GlobalSortingService,
    DateTimeSettingsService,
    DataClientsService,
    DataAccessClientsService,
    CnhTrowserService,
    CnhSnackBarService,
    {
      provide: 'window',
      useValue: window
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    }
  ],
  entryComponents: [
    CnhModalInviteComponent,
    CnhModalComponent,
    CnhTrowserComponent,
    CnhTrowserDataSharingComponent,
    InboxSetupdataDialogComponent
  ]
})
export class DataModule {}
