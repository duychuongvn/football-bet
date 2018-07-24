import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const appRoutes: Routes = [
  {
    path: '',
    loadChildren: 'app/home/home.module#HomeModule'
  },
  {
    path: 'user',
    loadChildren: 'app/user/user.module#UserModule'
  },
  {
    path: 'match-detail',
    loadChildren: 'app/match-detail/match-detail.module#MatchDetailModule'
  },
  {
    path: 'how-it-works',
    loadChildren: 'app/how-it-work/how-it-work.module#HowItWorkModule'
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
