import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';

const _route: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        loadChildren: 'app/matches-today/matches-today.module#MatchesTodayModule'
      },
      {
        path: 'tomorrow',
        loadChildren: 'app/matches-tomorrow/matches-tomorrow.module#MatchesTomorrowModule'
      },
      {
        path: 'future',
        loadChildren: 'app/matches-future/matches-future.module#MatchesFutureModule'
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(_route)
  ],
  declarations: [
    HomeComponent
  ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule { }
