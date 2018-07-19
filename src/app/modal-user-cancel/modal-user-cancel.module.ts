import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalUserCancelComponent } from './modal-user-cancel.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ModalUserCancelComponent],
  entryComponents: [ModalUserCancelComponent],
  exports: [ModalUserCancelComponent]
})
export class ModalUserCancelModule { }
