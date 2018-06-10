import { Routes } from '@angular/router';
import { AdminComponent  } from 'app/admin/admin.component';
import { HomeComponent } from 'app/home/home.component';
import { UserComponent } from 'app/user/user.component';
import { MatchDetailComponent } from './match-detail/match-detail.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'admin',
    component: AdminComponent
  },
  {
    path: 'user',
    component: UserComponent
  },

  {
    path: 'match-detail',
    component: MatchDetailComponent
  },
  {
    path: '**',
    component: HomeComponent,
    pathMatch: 'full'
  }
];
