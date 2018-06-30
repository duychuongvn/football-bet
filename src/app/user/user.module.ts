import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { UserComponent } from './user.component';

import {MatchPipe} from './match.pipe';
import {BettingPipe} from './betting.pipe';

const _router: Routes = [
  {
    path: '',
    component: UserComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(_router)
  ],
  declarations: [
    UserComponent,
    MatchPipe,BettingPipe
  ],
  exports: [
    UserComponent
  ]
})
export class UserModule { }
