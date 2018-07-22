import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule, NG_SELECT_DEFAULT_CONFIG } from '@ng-select/ng-select';

import { SdcImageModule } from 'shared/sdc-image/sdc-image.module';

import { DealModalComponent } from './deal-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SdcImageModule,
    NgSelectModule
  ],
  declarations: [
    DealModalComponent
  ],
  entryComponents: [
    DealModalComponent
  ],
  providers: [
    {
      provide: NG_SELECT_DEFAULT_CONFIG,
      useValue: {
        notFoundText: 'Custom not found'
      }
    }
  ],
  exports: [
    DealModalComponent
  ]
})
export class DealModalModule { }
