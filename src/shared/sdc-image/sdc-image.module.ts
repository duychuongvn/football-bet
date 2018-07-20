import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SdcImageComponent } from './sdc-image.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SdcImageComponent],
  exports: [SdcImageComponent]
})
export class SdcImageModule { }
