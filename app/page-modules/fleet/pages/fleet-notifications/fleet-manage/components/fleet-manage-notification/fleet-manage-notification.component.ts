import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UserService } from '@services/user/user.service';
import { MatDialog } from '@angular/material';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FleetPostNotificationService } from '@fleet/pages/fleet-notifications/fleet-manage/services/fleet-post-notification.service';

@Component({
  selector: 'app-fleet-manage-notification',
  templateUrl: './fleet-manage-notification.component.html',
  styleUrls: ['./fleet-manage-notification.component.css'],
  animations: [
    trigger('hideNotification', [
      state(
        'collapsed',
        style({
          height: '0',
          minHeight: '0',
          display: 'none',
          overflow: 'hidden'
        })
      ),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('400ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class FleetManageNotificationComponent implements OnInit {
  dataLoaded = false;
  public brand: string;
  isCollapsed = false;
  checked: boolean;
  emailChecked: boolean;

  @Output()
  editPreference = new EventEmitter<string>();
  @Output()
  editNotification = new EventEmitter<string>();

  @Output()
  editNotificationGroup = new EventEmitter();
  @Output()
  deleteNotification = new EventEmitter<string>();

  @Input()
  public notificationList: any;
  @Input()
  public notificationType: any;
  @Input()
  public notificationCount: number;

  @Input()
  notificationTitle: string;
  phoneCheck = false;
  emailCheck = false;
  checkSMSValue = 0;

  constructor(
    private userService: UserService,
    private postNotification: FleetPostNotificationService
  ) {}

  ngOnInit() {
    this.brand = this.userService['_user'].brand;
    const details = this.userService.getUserPhone();
    if (!details.phone) {
      this.phoneCheck = true;
    } else {
      this.phoneCheck = false;
    }
    if (!details.email) {
      this.emailCheck = true;
    } else {
      this.emailCheck = false;
    }

    if (this.notificationType === 'DEFAULT') {
      this.checkSMSValue = this.postNotification.getFaultNotificationList().length;
    }
  }

  childEditPreference(id) {
    this.editPreference.emit(id);
    this.editNotificationGroup.emit();
  }
  editCustomNotification(id) {
    this.editNotification.emit(id);
  }
  childDeleteNotification(id: string) {
    this.deleteNotification.emit(id);
  }
}
