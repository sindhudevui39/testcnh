import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { UserService } from '@services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class FleetGuardService implements CanActivate {
  constructor(private _router: Router, private _userService: UserService) {}

  canActivate(): Observable<boolean> {
    return this._userService.isDealer$.pipe(
      filter(val => val !== null),
      map(isDealer => {
        if (!isDealer) {
          return true;
        } else {
          this._router.navigate(['/fleet']);
          return false;
        }
      })
    );
  }
}
