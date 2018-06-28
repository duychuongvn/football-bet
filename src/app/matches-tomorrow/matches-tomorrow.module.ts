import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { MatchesTomorrowComponent } from './matches-tomorrow.component';

const _route: Routes = [
  {
    path: '',
    component: MatchesTomorrowComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(_route)
  ],
  declarations: [MatchesTomorrowComponent],
  exports: [MatchesTomorrowComponent]
})
export class MatchesTomorrowModule { }
