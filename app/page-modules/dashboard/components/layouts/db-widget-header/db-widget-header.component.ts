import { Component } from '@angular/core';

@Component({
  selector: 'db-widget-header',
  templateUrl: './db-widget-header.component.html',
  styleUrls: ['./db-widget-header.component.css']
})
export class DbWidgetHeaderComponent {
  hideOval = true;

  onClose() {
    this.hideOval = true;
  }

  onClick() {
    this.hideOval = false;
  }
}
