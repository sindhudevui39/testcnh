import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuardService } from './core/guards/auth-guard.service';
import { FleetGuardService } from './core/guards/fleet-guard.service';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: './page-modules/dashboard/dashboard.module#DashboardModule',
    canActivate: [FleetGuardService, AuthGuardService]
  },
  {
    path: 'fleet',
    loadChildren: './page-modules/fleet/fleet.module#FleetModule'
  },
  {
    path: 'data-access',
    redirectTo: 'data/data-access/my-data'
  },
  {
    path: 'data',
    loadChildren: './page-modules/data/data.module#DataModule',
    canActivate: [FleetGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
