import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalInstallMetamaskComponent } from './modal-install-metamask.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ModalInstallMetamaskComponent],
  entryComponents: [ModalInstallMetamaskComponent],
  exports: [ModalInstallMetamaskComponent]
})
export class ModalInstallMetamaskModule { }
