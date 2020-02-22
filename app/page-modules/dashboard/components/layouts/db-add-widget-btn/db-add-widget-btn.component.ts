import { Component, OnInit, HostBinding } from '@angular/core';

import { Widgets, SMALL_WIDGET_HEIGHT } from '@dashboard/utils/db-widgets.enum';
import { EventsService } from '@services/events/events.service';

@Component({
  selector: 'db-add-widget-btn',
  templateUrl: './db-add-widget-btn.component.html',
  styleUrls: ['./db-add-widget-btn.component.css']
})
export class DbAddWidgetBtnComponent implements OnInit {
  @HostBinding('class.item')
  @HostBinding('id')
  private id = Widgets.ADD_WIDGET_BUTTON;
  @HostBinding('style.height.px')
  private elementHeight = SMALL_WIDGET_HEIGHT;

  constructor(private eventsService: EventsService) {}

  ngOnInit() {}

  sendEvent() {
    this.eventsService.openAddWidgetDialog('open dialog');
  }
}
