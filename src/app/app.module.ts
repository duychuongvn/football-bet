import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, enableProdMode } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { ModalModule } from 'ngx-bootstrap/modal';

import { HeaderModule } from './header/header.module';
import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './footer/footer.module';
import { ModalVersionModule } from './modal-version/modal-version.module';
import { ModalInstallMetamaskModule } from './modal-install-metamask/modal-install-metamask.module';

import { AppRoutingModule } from './app.router';
import { AppComponent } from './app.component';

import { EventEmitterService, MatchService, NotifyService, SolobetService, UserService, Web3Service } from 'service/service';

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
    FooterModule,
    SidebarModule,
    ModalVersionModule,
    ModalInstallMetamaskModule,
    ModalModule.forRoot(),
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
