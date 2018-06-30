import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ComingSoonComponent } from './coming-soon.component';

const _router: Routes = [
  {
    path: '',
    component: ComingSoonComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(_router)
  ],
  declarations: [ComingSoonComponent],
  exports: [ComingSoonComponent]
})
export class ComingSoonModule { }
