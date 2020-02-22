import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgSelectModule } from '@ng-select/ng-select';

import { CustomMaterialModule } from '@shared-modules/custom-material/custom-material.module';
import { LoadingModule } from '@shared-modules/loading/loading.module';

export const sharedModules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,

  NgSelectModule,
  PerfectScrollbarModule,

  CustomMaterialModule,
  LoadingModule
];
