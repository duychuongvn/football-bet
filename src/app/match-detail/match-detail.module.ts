import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DealModalModule } from 'app/deal-modal/deal-modal.module';
import { AcceptOddsModalModule } from 'app/accept-odds-modal/accept-odds-modal.module';

import { MatchDetailComponent } from './match-detail.component';

const _route: Routes = [
  {
    path: '',
    component: MatchDetailComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(_route),
    ModalModule.forRoot(),
    DealModalModule,
    AcceptOddsModalModule
  ],
  declarations: [
    MatchDetailComponent
  ],
  exports: [
    MatchDetailComponent
  ]
})
export class MatchDetailModule { }
