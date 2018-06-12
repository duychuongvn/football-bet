import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from "app/app.router";
import { AppComponent } from "./app.component";

import {
  SolobetService,
  Web3Service,
  MatchService,
  UserService,
  NotifyService
} from "../service/service";

const SERVICES = [
  SolobetService,
  Web3Service,
  MatchService,
  MatchService,
  UserService,
  NotifyService
];

@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    HttpModule,
    AppRoutingModule,
    FormsModule,
    ToastrModule.forRoot()
  ],
  declarations: [AppComponent],
  providers: [SERVICES],
  bootstrap: [AppComponent]
})
export class AppModule {}
