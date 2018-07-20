import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';

import { ModalUserCancelModule } from '../modal-user-cancel/modal-user-cancel.module';

import { UserOpenMatchesComponent } from './user-open-matches.component';

const _router: Routes = [
  {
    path: '',
    component: UserOpenMatchesComponent
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
  declarations: [UserOpenMatchesComponent],
  exports: [UserOpenMatchesComponent]
})
export class UserOpenMatchesModule { }
