import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { HomeComponent } from './home/home.component';
// import { BrowserModule } from '@angular/platform-browser';

import {SolobetService, Web3Service, MatchService} from '../service/service';

const SERVICES = [
  SolobetService,
  Web3Service,
  MatchService

]

@NgModule({

  declarations: [
    AppComponent,
    AdminComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      {
        path: 'admin',
        component: AdminComponent
      },
      {
        path: '',
        component: HomeComponent
      }
    ])
  ],
  providers: [SERVICES],
  bootstrap: [AppComponent]
})
export class AppModule { }
