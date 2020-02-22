import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  HostListener
} from '@angular/core';

import { BrandNames, BrandColors } from '@enums/brand.enum';
import { UserService } from '@services/user/user.service';
import { DashboardService } from '@dashboard/services/dashboard/dashboard.service';
import { widgetList } from './db-add-widget-image-properties';
import { EventsService } from '@services/events/events.service';

@Component({
  selector: 'db-add-widget-dialog',
  templateUrl: './db-add-widget-dialog.component.html',
  styleUrls: ['./db-add-widget-dialog.component.css']
})
export class DbAddWidgetDialogComponent implements OnInit, AfterViewInit {
  @ViewChild('dialogContentRef', { read: ElementRef })
  dialogContentRef: ElementRef;

  @ViewChild('widgetListContentRef', { read: ElementRef })
  widgetListContentRef: ElementRef;

  imageDescription = 'Select a widget for further infomation';
  isWidgetSelected = false;
  widgetToAdd = '';
  images: Array<any>;
  highlightId: string;
  buttonBGColor: string;
  brand: string;
  brands = BrandNames;
  displayContentSeparator = false;

  constructor(
    private eventsService: EventsService,
    private userService: UserService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {
    this.brand = this.userService.getBrand();

    const widget = this.dashboardService.getAvailableWidgets();

    this.images = widgetList.map(content => {
      if (widget.indexOf(content.id) !== -1) {
        content.enabled = true;
      }

      return content;
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.shouldDisplaySeparator();
    }, 100);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.shouldDisplaySeparator();
  }

  selectWidget(event: Event) {
    const id = event.target['id'];

    this.isWidgetSelected = true;

    this.buttonBGColor =
      this.userService.getBrand() === BrandNames.CIH ? BrandColors.CIH : BrandColors.NH;

    this.widgetToAdd = id;

    this.imageDescription = widgetList.filter(content => content.id === id)[0].prop.text;
  }

  onAdd() {
    this.images.map(content => {
      if (content.id === this.widgetToAdd) {
        content.enabled = false;
      }

      return content;
    });

    this.eventsService.addWidget(this.widgetToAdd);
  }

  shouldDisplaySeparator() {
    const dialogContentEl = this.dialogContentRef.nativeElement as HTMLElement;
    const widgetListContentEl = this.widgetListContentRef.nativeElement as HTMLElement;

    if (widgetListContentEl.scrollHeight > dialogContentEl.clientHeight) {
      this.displayContentSeparator = true;
    } else {
      this.displayContentSeparator = false;
    }
  }
}
