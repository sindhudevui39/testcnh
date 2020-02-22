import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetOverviewComponent } from './fleet-overview.component';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { MatIconModule, MatExpansionModule, MatMenuModule } from '@angular/material';
import { LoaderComponent } from '@shared-modules/loading/loader.component';
import { SearchComponent } from '@shared-components/search/search.component';
import { SearchHighlightPipe } from '@fleet/pipes/search-highlight.pipe';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FleetOverviewListHeaderComponent } from './components/fleet-overview-list-header/fleet-overview-list-header.component';
import { FleetOverviewListItemComponent } from './components/fleet-overview-list-item/fleet-overview-list-item.component';
import { WordWrapTooltipDirective } from '@shared-directives/word-wrap-tooltip/word-wrap-tooltip.directive';

describe('FleetOverviewComponent', () => {
  let component: FleetOverviewComponent;
  let fixture: ComponentFixture<FleetOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        MatMenuModule,
        PerfectScrollbarModule,
        MatExpansionModule,
        TranslateTestingModule.withTranslations({})
      ],
      declarations: [
        FleetOverviewComponent,
        FleetOverviewListItemComponent,
        FleetOverviewListHeaderComponent,
        LoaderComponent,
        SearchComponent,
        SearchHighlightPipe,
        WordWrapTooltipDirective
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
