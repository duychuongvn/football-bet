import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from "app/app.router";

import { AppComponent } from "./app.component";

import {
  SolobetService,
  Web3Service,
  MatchService,
  UserService
} from "../service/service";
import { MatchDetailComponent } from "./match-detail/match-detail.component";

const SERVICES = [
  SolobetService,
  Web3Service,
  ,
  MatchService,
  MatchService,
  UserService
];

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    AppRoutingModule,
    FormsModule


  ],
  declarations: [AppComponent, MatchDetailComponent],
  providers: [SERVICES],
  bootstrap: [AppComponent]
})
export class AppModule {}
