import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { RDV_TRANSLATIONS } from '@remote-display/rdv.constants';
import { TranslatedRDVLabels } from '@remote-display/rdv.enums';

@Injectable({
  providedIn: 'root'
})
export class TranslatedRDVLabelStoreService {
  private _translatedLabelMap = new Map<string, string>();

  constructor(private _translateService: TranslateService) {
    this._translateService.get(RDV_TRANSLATIONS).subscribe(data => {
      for (const key in data) {
        if (key) {
          this.addLabel(key, data[key]);
        }
      }
    });
  }

  public addLabel(key: string, value: string) {
    this._translatedLabelMap.set(key, value);
  }

  public getLabel(key: TranslatedRDVLabels) {
    return this._translatedLabelMap.get(TranslatedRDVLabels[key]);
  }
}
