import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import * as _ from 'underscore';

import { UserService } from '@services/user/user.service';
import {
  FleetPostNotificationService,
  UserData
} from '@fleet/pages/fleet-notifications/fleet-manage/services/fleet-post-notification.service';
import { FleetManageService } from '@fleet/pages/fleet-notifications/fleet-manage/services/fleet-manage.service';

@Component({
  selector: 'app-fleet-user-select',
  templateUrl: './fleet-user-select.component.html',
  styleUrls: ['./fleet-user-select.component.css'],
  animations: [
    trigger('hideNotification', [
      state(
        'collapsed',
        style({
          height: '0',
          minHeight: '0',
          overflow: 'hidden',
          display: 'none'
        })
      ),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('350ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class FleetUserSelectComponent implements OnInit, OnDestroy {
  private usersList: any;

  // Data
  dataSelection = {};
  companies: Array<any>;
  roles: Array<any>;

  // Checkbox
  isCollapsed = [];
  isCollapsedAll = false;
  masterToggleChecked = false;
  masterIndeterminate = false;
  checkedList = {};

  userEmail: string;
  collapse = 'COLLAPSE ALL';
  dataLoaded = false;
  allCompanies: string;
  allRoles: string;

  selectedCompanyValue = '';
  selectedRoleValue = '';
  checkUserList = 0;

  constructor(
    private fleetManageService: FleetManageService,
    private fleetPostNotificationService: FleetPostNotificationService,
    public userService: UserService
  ) {}
  ngOnDestroy() {
    this.fleetPostNotificationService.userSelectionSearch({ searchString: '' });
  }
  ngOnInit() {
    this.userEmail = this.userService['_user'].email;

    let triggerUserAPI = false;
    if (!_.isEmpty(this.fleetManageService.editNotificationDetails)) {
      this.fleetManageService.currentIndex$.subscribe(index => {
        if (index === 2 && !triggerUserAPI) {
          this.fleetPostNotificationService
            .getUserListSelectedNotification(
              this.fleetManageService.editNotificationDetails.notificationGroupId
            )
            .subscribe(res => {
              res.forEach(selectedUser => {
                _.keys(this.usersList).forEach(key => {
                  this.usersList[key].forEach(user => {
                    if (user.email === selectedUser.email) {
                      this.toggleData({ checked: true }, key, user);
                    }
                  });
                });
              });
              triggerUserAPI = true;
            });
        }
      });
    }
    this.fleetPostNotificationService.userList();
    const { allCompanies, allRoles } = this.fleetPostNotificationService.translatedWords;

    this.allCompanies = allCompanies;
    this.allRoles = allRoles;
    this.fleetPostNotificationService.defaultCompanyTitle = this.allCompanies;
    this.fleetPostNotificationService.defaultRoleTitle = this.allRoles;

    this.fleetPostNotificationService.companyDropdownTitle = this.allCompanies;
    this.fleetPostNotificationService.roleDropdownTitle = this.allRoles;

    this.selectedCompanyValue = this.fleetPostNotificationService.companyDropdownTitle;
    this.selectedRoleValue = this.fleetPostNotificationService.roleDropdownTitle;

    this.fleetPostNotificationService.userList$.subscribe(data => {
      if (data) {
        this.dataSelection = {};

        for (const key in data) {
          if (key) {
            this.dataSelection[key] = new SelectionModel<any>(true, []);
            this.isCollapsed.push(false);

            if (!this.dataLoaded) {
              this.checkedList[key] = [];
            }
          }
        }

        this.usersList = data;

        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const element = data[key];

            this.usersList[key] = [];

            element.forEach(e => {
              if (e.email !== this.userEmail) {
                this.usersList[key].push(e);
              }
            });
            this.checkUserList = this.usersList[key].length;
          }
        }
        this.companies = [{ name: this.allCompanies, id: 'all_companies' }];
        this.roles = [{ name: this.allRoles, id: 'all_roles' }];

        for (const key in data) {
          if (key) {
            const company = {
              name: key
            };

            this.companies.push(company);

            const element = this.usersList[key];

            element.forEach(e => {
              if (!this.roles.map(m => m.name).includes(e.role)) {
                const role = {
                  name: e.role ? e.role : 'UNKNOWN'
                };
                this.roles.push(role);
              }
            });

            for (const val in data[key]) {
              if (val) {
                for (let i = 0; i < this.checkedList[key].length; i++) {
                  const elemen = this.checkedList[key][i];
                  if (this.usersList[key][val].id === elemen.id) {
                    this.dataSelection[key].toggle(this.usersList[key][val]);
                    break;
                  }
                }
              }
            }
          }
        }
        this.selectedCompanyValue = this.fleetPostNotificationService.companyDropdownTitle;
        this.selectedRoleValue = this.fleetPostNotificationService.roleDropdownTitle;

        if (!this.dataLoaded) {
          this.dataLoaded = true;
        }
      }
    });
  }

  masterToggle() {
    const selectedIds = [];

    if (!this.masterToggleChecked) {
      for (const k in this.usersList) {
        if (k) {
          (this.usersList[k] as Array<any>).forEach(f => {
            selectedIds.push(f.id);
          });

          this.usersList[k].forEach(row => this.dataSelection[k].select(row));
        }
      }
    } else {
      for (const k in this.usersList) {
        if (k) {
          this.usersList[k].forEach(row => this.dataSelection[k].clear(row));
          selectedIds.push();
        }
      }
    }

    this.masterToggleChecked = !this.masterToggleChecked;

    if (!this.masterToggleChecked) {
      for (const k in this.checkedList) {
        if (this.checkedList.hasOwnProperty(k)) {
          this.checkedList[k] = [];
        }
      }
    } else {
      for (const k in this.checkedList) {
        if (this.checkedList.hasOwnProperty(k)) {
          this.checkedList[k] = [...this.usersList[k]];
        }
      }
    }

    this.updateUserList();
  }

  dataToggle(key) {
    if (key) {
      if (this.isAllDataSelected(key)) {
        this.dataSelection[key].clear();
        this.checkedList[key] = [];
      } else {
        this.usersList[key].forEach(row => this.dataSelection[key].select(row));
        this.checkedList[key] = [...this.usersList[key]];
      }
    }

    this.setMasterCheckbox();
  }

  isAllDataSelected(key) {
    let numSelected: number;
    numSelected = this.dataSelection[key].selected.length;

    const numRows = this.usersList[key].length;

    return numSelected === numRows;
  }

  setMasterCheckbox() {
    let selectedLength = 0;
    let totalSetupsLength = 0;

    const selectedIds = [];

    for (const k in this.dataSelection) {
      if (k) {
        const selectedLength1 = this.dataSelection[k].selected.length;
        const totalSetupsLength1 = this.usersList[k].length;
        selectedLength = selectedLength + selectedLength1;
        totalSetupsLength = totalSetupsLength + totalSetupsLength1;

        (this.dataSelection[k].selected as Array<any>).forEach(f => {
          selectedIds.push(f.id);
        });
      }
    }

    if (selectedLength === 0) {
      this.masterIndeterminate = false;
      this.masterToggleChecked = false;
    } else if (selectedLength < totalSetupsLength) {
      this.masterIndeterminate = true;
    } else {
      this.masterIndeterminate = false;
      this.masterToggleChecked = true;
    }

    this.updateUserList();
  }

  toggleData($event, vehicleKey, vehicleValue) {
    if ($event && $event.checked) {
      this.checkedList[vehicleKey].push(vehicleValue);
    } else {
      for (let i = 0; i < this.checkedList[vehicleKey].length; i++) {
        const element = this.checkedList[vehicleKey][i];

        if (element.id === vehicleValue.id) {
          this.checkedList[vehicleKey].splice(i, 1);
        }
      }
    }
    const value = $event ? this.dataSelection[vehicleKey].toggle(vehicleValue) : null;

    this.setMasterCheckbox();
  }

  collapsedAll(i?) {
    if (i || i === 0) {
      // Collapse/Expand individual
      this.isCollapsed[i] = !this.isCollapsed[i];
    } else {
      // Collapse/Expand all
      if (this.collapse === 'COLLAPSE ALL') {
        this.isCollapsed.forEach((item, index) => {
          this.isCollapsed[index] = true;
        });
      } else {
        this.isCollapsed.forEach((item, index) => {
          this.isCollapsed[index] = false;
        });
      }
    }

    let count = 0;

    for (let idx = 0; idx < this.isCollapsed.length; idx++) {
      if (this.isCollapsed[idx]) {
        count++;
      }
    }

    if (count > 0) {
      this.collapse = 'EXPAND ALL';
    } else {
      this.collapse = 'COLLAPSE ALL';
    }
  }
  updateUserList() {
    const users = [];

    for (const key in this.checkedList) {
      if (this.checkedList.hasOwnProperty(key)) {
        const element = this.checkedList[key];

        element.forEach(el => {
          users.push({
            userId: el.email,
            email: el.email,
            phone: el.phone,
            tzOffset: 0,
            channel: ['WEB']
          } as UserData);
        });
      }
    }

    this.fleetPostNotificationService.userData = [];
    this.fleetPostNotificationService.userData = users;
  }

  public filterUsers(event: any, dropdownType: string): void {
    this.fleetPostNotificationService.filterUserSelection(event, dropdownType);
  }

  public searchUsers(event: any): void {
    this.fleetPostNotificationService.userSelectionSearch(event);
  }
}
