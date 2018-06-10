import { Routes } from '@angular/router';
import { MatchDetailComponent } from './match-detail/match-detail.component';

export const appRoutes: Routes = [
  {
    path: '',
    loadChildren: 'app/home/home.module#HomeModule'
  },
  {
    path: 'admin',
    loadChildren: 'app/admin/admin.module#AdminModule'
  },
  {
    path: 'user',
    loadChildren: 'app/user/user.module#UserModule'
  },

  {
    path: 'match-detail',
    component: MatchDetailComponent
  },
  {
    path: '**',
    loadChildren: 'app/home/home.module#HomeModule',
    pathMatch: 'full'
  }
];
