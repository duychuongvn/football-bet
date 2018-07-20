import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'ngx-bootstrap/accordion';

import { MatchesTodayComponent } from './matches-today.component';

const _route: Routes = [
  {
    path: '',
    component: MatchesTodayComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    AccordionModule.forRoot(),
    RouterModule.forChild(_route)
  ],
  declarations: [MatchesTodayComponent],
  exports: [MatchesTodayComponent]
})
export class MatchesTodayModule { }
