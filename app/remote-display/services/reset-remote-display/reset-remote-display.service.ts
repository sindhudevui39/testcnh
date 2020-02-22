import { Injectable } from '@angular/core';
import { BrandNames, BrandColors } from '@enums/brand.enum';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '@services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class ResetRemoteDisplayService {
  constructor(public readonly translate: TranslateService, public userService: UserService) {}

  public resetRemoteDisplay() {
    let id = document.getElementById('vId');
    if (id !== null) {
      id = id['value'];
      const rmtSpan = document.getElementById('rmtSpan');
      const rmBut = document.getElementById('remotebut');
      if (rmBut !== null) {
        rmtSpan.innerHTML = this.translate.instant('PAGE_RDV.DISPLAY');
        rmBut['disabled'] = false;
        rmBut.style.cursor = 'pointer';
        rmBut.style.color = '#fff';
        rmBut.style.backgroundColor = this.getBrandColor();
      }
    }
  }
  private getBrandColor() {
    switch (this.userService.getBrand()) {
      case BrandNames.CIH:
        return BrandColors.CIH;

      case BrandNames.NH:
        return BrandColors.NH;

      default:
        break;
    }
  }
}
