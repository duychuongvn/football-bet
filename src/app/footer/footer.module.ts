import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { FooterComponent } from './footer.component';

@NgModule({
  imports: [
    CommonModule,
    TooltipModule.forRoot(),
    RouterModule.forChild([])
  ],
  declarations: [FooterComponent],
  exports: [FooterComponent]
})
export class FooterModule { }
