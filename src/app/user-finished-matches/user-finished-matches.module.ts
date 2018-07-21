import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgSelectModule, NG_SELECT_DEFAULT_CONFIG } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';

import { ModalUserCancelModule } from '../modal-user-cancel/modal-user-cancel.module';

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
    NgSelectModule,
    FormsModule,
    RouterModule.forChild(_router),
    AccordionModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    ModalUserCancelModule
  ],
  declarations: [UserFinishedMatchesComponent],
  exports: [UserFinishedMatchesComponent],
  providers: [
    {
      provide: NG_SELECT_DEFAULT_CONFIG,
      useValue: {
          notFoundText: 'Custom not found'
      }
    }
  ]
})
export class UserFinishedMatchesModule { }
