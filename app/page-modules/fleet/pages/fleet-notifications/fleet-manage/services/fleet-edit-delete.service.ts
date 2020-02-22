import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Urls } from '@enums/urls.enum';
import { UserService } from '@services/user/user.service';
import { FleetUrls } from '@fleet/services/fleet-api/fleet-urls.enum';

export interface IJSONPatchOperation {
  op: 'replace' | 'add' | 'add' | 'replace';
  path: string;
  value: any;
}

@Injectable({
  providedIn: 'root'
})
export class FleetEditDeleteService {
  userEmail: string;

  constructor(private http: HttpClient, private userService: UserService) {
    this.userEmail = userService['_user'].email;
  }

  deleteNotification(id: string) {
    return this.http.delete(`${FleetUrls.FLEET_DELETE_CUSTOM_NOTIFICATION}?id=${id}`);
  }

  deleteUserNotification(groupId: string, userEmail: string) {
    return this.http.delete(
      `${FleetUrls.FLEET_DELETE_USER_NOTIFICATION}?groupId=${groupId}&userEmail=${userEmail}`
    );
  }

  editNotification({ id, channel, phone, email, notificationType }) {
    const customNotification: IJSONPatchOperation[] = [
      {
        op: 'replace',
        path: '/channel',
        value: channel
      },
      {
        op: 'add',
        path: '/preferredTimeZone',
        value: 'UTC'
      },
      {
        op: 'add',
        path: '/preferredDateTime',
        value: 'dd/MM/YYYY@h:mm A'
      },
      {
        op: 'replace',
        path: '/phone',
        value: phone
      }
    ];

    const userNotification: IJSONPatchOperation[] = [
      {
        op: 'replace',
        path: '/channel',
        value: channel
      },
      {
        op: 'add',
        path: '/preferredTimeZone',
        value: 'UTC'
      },
      {
        op: 'add',
        path: '/preferredDateTime',
        value: 'dd/MM/YYYY@h:mm A'
      }
    ];
    if (notificationType === 'ByMe') {
      return this.http.patch(
        `${FleetUrls.FLEET_EDIT_CUSTOM_NOTIFICATION}?groupId=${id}&userEmail=${this.userEmail}`,
        customNotification,
        {
          responseType: 'text' // some API might not return JSON, avoid auto-parse errors
        }
      );
    } else {
      return this.http.patch(
        `${FleetUrls.FLEET_EDIT_CUSTOM_NOTIFICATION}?groupId=${id}&userEmail=${this.userEmail}`,
        userNotification,
        {
          responseType: 'text' // some API might not return JSON, avoid auto-parse errors
        }
      );
    }
  }
}
