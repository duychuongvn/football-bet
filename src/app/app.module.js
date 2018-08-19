import * as tslib_1 from "tslib";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HeaderModule } from 'app/header/header.module';
import { SidebarModule } from 'app/sidebar/sidebar.module';
import { ModalVersionModule } from 'app/modal-version/modal-version.module';
import { ModalInstallMetamaskModule } from 'app/modal-install-metamask/modal-install-metamask.module';
import { AppRoutingModule } from 'app/app.router';
import { AppComponent } from './app.component';
import { EventEmitterService, MatchService, NotifyService, SolobetService, UserService, Web3Service, BetherService } from 'service/service';
const SERVICES = [
    SolobetService,
    Web3Service,
    MatchService,
    MatchService,
    UserService,
    NotifyService,
    EventEmitterService,
    BetherService
];
let AppModule = class AppModule {
};
AppModule = tslib_1.__decorate([
    NgModule({
        imports: [
            BrowserAnimationsModule,
            BrowserModule,
            HttpClientModule,
            HttpModule,
            AppRoutingModule,
            FormsModule,
            HeaderModule,
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
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map