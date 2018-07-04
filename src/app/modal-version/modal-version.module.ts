import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalVersionComponent } from './modal-version.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ModalVersionComponent],
  entryComponents: [ModalVersionComponent],
  exports: [ModalVersionComponent]
})
export class ModalVersionModule { }
