import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DealModalComponent } from './deal-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    DealModalComponent
  ],
  entryComponents: [
    DealModalComponent
  ],
  exports: [
    DealModalComponent
  ]
})
export class DealModalModule { }
