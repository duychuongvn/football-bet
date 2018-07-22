import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SdcImageModule } from 'shared/sdc-image/sdc-image.module';
import { DealModalModule } from '../deal-modal/deal-modal.module';
import { AcceptOddsModalModule } from '../accept-odds-modal/accept-odds-modal.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

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
    TooltipModule.forRoot(),
    DealModalModule,
    AcceptOddsModalModule,
    SdcImageModule
  ],
  declarations: [
    MatchDetailComponent
  ],
  exports: [
    MatchDetailComponent
  ]
})
export class MatchDetailModule { }
