import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { UserService } from '@services/user/user.service';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private _router: Router, private _userService: UserService) {}

  canActivate(): Observable<boolean> {
    return this._userService.hasDashboardAccess$.pipe(
      filter(val => val !== null),
      map(val => {
        if (val && !this._userService.getUser().isDealer) {
          return true;
        } else if (this._userService.getUser().isDealer) {
          this._router.navigate(['/fleet/overview']);
          return false;
        } else {
          this._router.navigate([environment.defaultRoute]);
          return false;
        }
      })
    );
  }
}
