import { Routes } from '@angular/router';
import { HomeModule } from 'app/home/home.module';
import { AdminModule } from 'app/admin/admin.module';
import { UserModule } from 'app/user/user.module';

import { MatchDetailComponent } from './match-detail/match-detail.component';

export const appRoutes: Routes = [
  {
    path: '',
    loadChildren: () => HomeModule
  },
  {
    path: 'admin',
    loadChildren: () => AdminModule
  },
  {
    path: 'user',
    loadChildren: () => UserModule
  },
  {
    path: 'details',
    component: MatchDetailComponent
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
