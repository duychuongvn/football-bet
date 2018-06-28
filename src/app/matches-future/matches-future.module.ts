import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { MatchesFutureComponent } from './matches-future.component';

const _route: Routes = [
  {
    path: '',
    component: MatchesFutureComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(_route)
  ],
  declarations: [MatchesFutureComponent],
  exports: [MatchesFutureComponent]
})
export class MatchesFutureModule { }
