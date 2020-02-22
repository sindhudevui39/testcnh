import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { UserService } from '@services/user/user.service';

export interface CanComponentDeactivate {
  canDeactivate: () => boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  constructor(private _userService: UserService) {}
  canDeactivate(component: CanComponentDeactivate): boolean {
    return !this._userService.isDealer$.value;
  }
}
