import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UserService } from '@services/user/user.service';
import { Urls } from '@enums/urls.enum';
import { DbWidgetMapService } from '@dashboard/services//db-widget-map/db-widget-map.service';
import { WidgetOrder, defaultPreference } from '@dashboard/utils/db-widgets.enum';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private _userPreferences: Array<WidgetOrder>;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private widgetMapService: DbWidgetMapService
  ) {}

  get userPreferences(): Array<WidgetOrder> {
    return this._userPreferences;
  }

  set userPreferences(userPref: Array<WidgetOrder>) {
    this._userPreferences = userPref;
  }

  getAvailableWidgets() {
    const unavailableWidgets: Array<string> = [];

    this._userPreferences.forEach(item => unavailableWidgets.push(item.element));

    const availableWidgets: Array<string> = defaultPreference.filter(
      id => unavailableWidgets.indexOf(id) === -1
    );

    return availableWidgets;
  }

  storeCurrentLayout(items: Array<any>) {
    this._userPreferences = [];

    items.forEach((item, index: number) => {
      const element = item._element.id;

      this._userPreferences.push({
        element,
        index
      });
    });
  }

  getComponent(id: string) {
    return this.widgetMapService.getComponent(id);
  }

  saveUserLayout(preferences) {
    const request: any = {
      email: this.userService.getUser().email,
      preferences
    };

    return this.http.put(`${Urls.USER_PREFERENCE}/${request.email}`, request, {
      observe: 'response'
    });
  }
}
