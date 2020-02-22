import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FleetPostNotificationService } from '@fleet/pages/fleet-notifications/fleet-manage/services/fleet-post-notification.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from '@services/user/user.service';
import { Urls } from '@enums/urls.enum';

@Component({
  selector: 'app-fleet-notifications',
  templateUrl: './fleet-notifications.component.html',
  styleUrls: ['./fleet-notifications.component.css']
})
export class FleetNotificationsComponent implements OnInit {
  constructor(
    private _fleetPostNotificationService: FleetPostNotificationService,
    private router: Router,
    private _http: HttpClient,
    private userService: UserService
  ) {}

  ngOnInit() {}
}
