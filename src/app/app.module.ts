import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { HomeModule } from '../app/home/home.module';
import { AdminModule } from '../app/admin/admin.module';
import { UserModule } from '../app/user/user.module';

import { SolobetService, Web3Service, MatchService } from '../service/service';

import { AppComponent } from './app.component';
import { MatchDetailComponent } from './match-detail/match-detail.component';

import { appRoutes } from '../app/app.router';

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
    RouterModule.forRoot(appRoutes),
    HomeModule,
    AdminModule,
    UserModule
  ],
  declarations: [
    AppComponent,
    MatchDetailComponent
  ],
  providers: [SERVICES],
  bootstrap: [AppComponent]
})
export class AppModule { }
