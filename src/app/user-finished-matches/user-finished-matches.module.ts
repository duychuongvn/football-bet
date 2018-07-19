import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';

import { ModalUserCancelModule } from 'app/modal-user-cancel/modal-user-cancel.module';

import { UserFinishedMatchesComponent } from './user-finished-matches.component';

const _router: Routes = [
  {
    path: '',
    component: UserFinishedMatchesComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(_router),
    AccordionModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    ModalUserCancelModule
  ],
  declarations: [UserFinishedMatchesComponent],
  exports: [UserFinishedMatchesComponent]
})
export class UserFinishedMatchesModule { }
