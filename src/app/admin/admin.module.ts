import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderModule } from 'app/header/header.module';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';

const _router: Routes = [
  {
    path: '',
    component: AdminComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HeaderModule,
    RouterModule.forChild(_router)
  ],
  declarations: [
    AdminComponent
  ],
  exports: [
    AdminComponent
  ]
})
export class AdminModule { }
