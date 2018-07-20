import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { HowItWorkComponent } from './how-it-work.component';

const _route: Routes = [
  {
    path: '',
    component: HowItWorkComponent
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(_route)
  ],
  declarations: [HowItWorkComponent],
  entryComponents: [HowItWorkComponent],
  exports: [HowItWorkComponent]
})
export class HowItWorkModule { }
