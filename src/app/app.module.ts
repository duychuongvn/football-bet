import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {ToastrModule} from 'ngx-toastr';

import { HeaderModule } from 'app/header/header.module';
import { SidebarModule } from 'app/sidebar/sidebar.module';

import {AppRoutingModule} from 'app/app.router';
import {AppComponent} from './app.component';

import {EventEmitterService, MatchService, NotifyService, SolobetService, UserService, Web3Service} from 'service/service';

const SERVICES = [
  SolobetService,
  Web3Service,
  MatchService,
  MatchService,
  UserService,
  NotifyService,
  EventEmitterService
];

@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    HttpModule,
    AppRoutingModule,
    FormsModule,
    HeaderModule,
    SidebarModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      preventDuplicates: true,
    })
  ],
  declarations: [AppComponent],
  providers: SERVICES,
  bootstrap: [AppComponent]
})
export class AppModule {
}
