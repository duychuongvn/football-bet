import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule, NG_SELECT_DEFAULT_CONFIG } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

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
    NgSelectModule,
    FormsModule,
    RouterModule.forChild(_router),
    AccordionModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    ModalUserCancelModule
  ],
  declarations: [UserOpenMatchesComponent],
  exports: [UserOpenMatchesComponent],
  providers: [
    {
      provide: NG_SELECT_DEFAULT_CONFIG,
      useValue: {
          notFoundText: 'Custom not found'
      }
    }
  ]
})
export class UserOpenMatchesModule { }
