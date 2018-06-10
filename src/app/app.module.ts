import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from 'app/app.router';

import { SolobetService, Web3Service, MatchService } from 'service/service';

import { AppComponent } from './app.component';
import { MatchDetailComponent } from './match-detail/match-detail.component';

const SERVICES = [
  SolobetService,
  Web3Service,
  MatchService
]

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    MatchDetailComponent
  ],
  providers: [SERVICES],
  bootstrap: [AppComponent]
})
export class AppModule { }
