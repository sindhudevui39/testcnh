import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ViewContainerRef,
  Output,
  EventEmitter,
  ComponentFactoryResolver,
  ChangeDetectorRef,
  Type,
  EmbeddedViewRef,
  OnDestroy
} from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';

import { MuuriEvent } from '@shared-directives/draggable/draggable.directive';
import { BrandNames } from '@enums/brand.enum';
import { UserService } from '@services/user/user.service';
import { EventsService } from '@services/events/events.service';
import { DashboardService } from '@dashboard/services/dashboard/dashboard.service';
import { Widgets, WidgetOrder } from '@dashboard/utils/db-widgets.enum';
import { DbAddWidgetDialogComponent } from '@dashboard/components/layouts/db-add-widget-dialog/db-add-widget-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'db-home',
  templateUrl: './db-home.component.html',
  styleUrls: ['./db-home.component.css']
})
export class DbHomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('widget', { read: ViewContainerRef })
  public widgetTargets: ViewContainerRef;

  widgetToAdd: HTMLElement;

  @Output()
  widgetToRemove: EventEmitter<string> = new EventEmitter<string>();

  addWidgetDialogRef: MatDialogRef<DbAddWidgetDialogComponent>;
  brands = BrandNames;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private ref: ChangeDetectorRef,
    private dialog: MatDialog,
    private _router: Router,
    public dashboardService: DashboardService,
    public userService: UserService,
    private eventsService: EventsService
  ) {}

  ngOnInit() {
    this.eventsService.addWidget$.subscribe(
      (id: string) => {
        if (id) {
          this.addWidget(id);
          this.addWidgetDialogRef.close();
        }
      },
      error => console.log(error)
    );

    this.eventsService.removeWidget$.subscribe(
      (id: string) => {
        if (id) {
          this.widgetToRemove.emit(id);
        }
      },
      error => console.log(error)
    );

    this.eventsService.openAddWidgetDialog$.subscribe(
      (event: string) => {
        if (event === 'open dialog') {
          this.addWidgetDialogRef = this.dialog.open(DbAddWidgetDialogComponent, {
            height: '85%',
            width: '80%'
          });
        }
      },
      error => console.log(error)
    );
  }

  ngAfterViewInit() {
    this.userService.userPreferences$.subscribe(
      response => {
        const data = response as Array<string>;
        const widgets: Array<Type<any>> = [];
        data.forEach((widgetId: string) => {
          const widget = this.dashboardService.getComponent(widgetId);
          if (widget) {
            widgets.push(widget);
          }
        });
        widgets.push(this.dashboardService.getComponent(Widgets.ADD_WIDGET_BUTTON));
        this.createComponents(widgets);
      },
      err => {
        if (err.status === 404) {
          const widgets: Array<Type<any>> = [];
          widgets.push(this.dashboardService.getComponent(Widgets.VEHICLE_STATUS));
          widgets.push(this.dashboardService.getComponent(Widgets.ADD_WIDGET_BUTTON));
          this.createComponents(widgets);
        }
      }
    );
  }

  ngOnDestroy() {
    this.widgetTargets.clear();
  }

  private createComponents(widgets: Array<Type<any>>) {
    widgets.forEach((widget: Type<any>) => {
      if (widget) {
        const widgetComponent = this.componentFactoryResolver.resolveComponentFactory(widget);

        this.widgetTargets.createComponent(widgetComponent);
      }
    });

    this.ref.detectChanges();
    this.eventsService.componentsLoaded(true);
  }

  private addWidget(widgetId) {
    const widgetItem = this.dashboardService.getComponent(widgetId);

    const widgetComponent = this.componentFactoryResolver.resolveComponentFactory(widgetItem);

    const componentRef = this.widgetTargets.createComponent(widgetComponent);

    this.ref.detectChanges();

    const element = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

    this.widgetToAdd = element;
  }

  updateUserPreferences(event: MuuriEvent) {
    this.dashboardService.storeCurrentLayout(event.items);

    if (event.type === 'save') {
      const preferences = this.filterUserPreferences(this.dashboardService.userPreferences);

      this.dashboardService.saveUserLayout(preferences).subscribe();
    }
  }

  private filterUserPreferences(preferences: Array<WidgetOrder>): Array<string> {
    return preferences
      .filter(widget => widget.element !== Widgets.ADD_WIDGET_BUTTON)
      .map(widget => widget.element);
  }
}
