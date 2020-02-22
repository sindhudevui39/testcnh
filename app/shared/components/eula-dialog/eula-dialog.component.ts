import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { AuthService } from '@services/auth/auth.service';
import { UserService } from '@services/user/user.service';

import { BrandColors, BrandNames } from '@enums/brand.enum';

@Component({
  selector: 'app-eula-dialog',
  templateUrl: './eula-dialog.component.html',
  styleUrls: ['./eula-dialog.component.css']
})
export class EulaDialogComponent implements OnInit {
  public eulaForm: FormGroup;
  public userBrand: string;
  public brandColor: string;
  public brands = BrandNames;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any[],
    private _dialogRef: MatDialogRef<EulaDialogComponent>,
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _userService: UserService
  ) {
    this.eulaForm = this._formBuilder.group({
      checkboxes: this._formBuilder.array(
        this.data.map(() => this._formBuilder.control(false, Validators.requiredTrue))
      )
    });
  }

  public ngOnInit(): void {
    this.userBrand = this._userService.getBrand();

    if (this.userBrand === BrandNames.CIH) {
      this.brandColor = BrandColors.CIH;
    } else {
      this.brandColor = BrandColors.NH;
    }
  }

  public get checkboxes(): FormArray {
    return this.eulaForm.get('checkboxes') as FormArray;
  }

  public onAccept(): void {
    this._dialogRef.close();
  }

  public onDecline(): void {
    this._authService.logout();
  }
}
