import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DealModalModule } from 'app/deal-modal/deal-modal.module';

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
    DealModalModule
  ],
  declarations: [
    MatchDetailComponent
  ],
  exports: [
    MatchDetailComponent
  ]
})
export class MatchDetailModule { }
