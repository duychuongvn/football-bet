import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeModule } from 'app/home/home.module';
import { AdminModule } from 'app/admin/admin.module';
import { UserModule } from 'app/user/user.module';
import { MatchDetailModule } from 'app/match-detail/match-detail.module';

const appRoutes: Routes = [
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
    path: 'match-detail',
    loadChildren: () => MatchDetailModule
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
