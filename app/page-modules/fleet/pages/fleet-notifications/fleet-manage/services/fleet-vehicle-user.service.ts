import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
interface RuleCreationSelection {
  step1: boolean;
  step2: boolean;
  step3: boolean;
  step4: boolean;
  step5: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FleetVehicleUserService {
  public _selection: RuleCreationSelection = {
    step1: true,
    step2: false,
    step3: false,
    step4: false,
    step5: false
  };

  public selectedVehicleIds$ = new BehaviorSubject<Array<string>>([]);
  public selectedVehicleModels$ = new BehaviorSubject<Array<string>>([]);

  public selectedVehicleModelsAfterPost$ = new BehaviorSubject<Array<string>>([]);
  public selecteduserIds$ = new BehaviorSubject<Array<string>>([]);
  public resetParameter$ = new BehaviorSubject<boolean>(false);
  public familiesCount$ = new BehaviorSubject<number>(0);
  public selection$ = new BehaviorSubject<RuleCreationSelection>(this._selection);
  public _currSelection = new BehaviorSubject<number>(0);

  constructor() {}

  updateSelection() {
    this._selection = {
      step1: true,
      step2: false,
      step3: false,
      step4: false,
      step5: false
    };
  }
}
