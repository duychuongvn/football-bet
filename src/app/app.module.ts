import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { HomeComponent } from './home/home.component';
// import { BrowserModule } from '@angular/platform-browser';

import {SolobetService, Web3Service, MatchService} from '../service/service';
import { MatchDetailComponent } from './match-detail/match-detail.component';
import { UserComponent } from './user/user.component';

const SERVICES = [
  SolobetService,
  Web3Service,
  MatchService

]

@NgModule({

  declarations: [
    AppComponent,
    AdminComponent,
    HomeComponent,
    MatchDetailComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      {
        path: 'admin',
        component: AdminComponent
      },
      {
        path: 'user',
        component: UserComponent
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
