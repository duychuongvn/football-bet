import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { NgSelectModule, NG_SELECT_DEFAULT_CONFIG } from '@ng-select/ng-select';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SdcImageModule } from 'shared/sdc-image/sdc-image.module';
import { DealModalModule } from '../deal-modal/deal-modal.module';
import { AcceptOddsModalModule } from '../accept-odds-modal/accept-odds-modal.module';
import { ModalSharingBetModule } from 'app/modal-sharing-bet/modal-sharing-bet.module';
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
    FormsModule,
    RouterModule.forChild(_route),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    NgSelectModule,
    DealModalModule,
    AcceptOddsModalModule,
    ModalSharingBetModule,
    SdcImageModule
  ],
  declarations: [
    MatchDetailComponent
  ],
  providers: [
    {
      provide: NG_SELECT_DEFAULT_CONFIG,
      useValue: {
          notFoundText: 'Custom not found'
      }
    }
  ],
  exports: [
    MatchDetailComponent
  ]
})
export class MatchDetailModule { }
