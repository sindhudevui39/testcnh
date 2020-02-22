import { Component, OnInit } from '@angular/core';

import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-loading-ring',
  templateUrl: './loading-ring.component.html',
  styleUrls: ['./loading-ring.component.css']
})
export class LoadingRingComponent implements OnInit {
  public borderColor: string;

  constructor(private _userService: UserService) {}

  ngOnInit() {
    if (this._userService.getBrand() === 'Case IH') {
      this.borderColor = 'var(--color-primary-caseih)';
    } else {
      this.borderColor = 'var(--color-primary-nh)';
    }
  }
}
