import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

import { Web3Service, SolobetService, EventEmitterService } from 'service/service';

import { METAMASK } from 'enums/metamask';

import { ModalVersionComponent } from './modal-version/modal-version.component';
import { ModalInstallMetamaskComponent } from './modal-install-metamask/modal-install-metamask.component';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private _subscription: Subscription;

  constructor(
    private _modalService: BsModalService,
    private _web3Service: Web3Service,
    private _solobetService: SolobetService,
    private _eventEmmitt: EventEmitterService
  ) {
    this._web3Service.checkAndInstantiateWeb3();

    if (this._web3Service.web3) {
      this._solobetService.initProvider();
    }
  }

  ngOnInit() {
    this._subscription = this._eventEmmitt.caseNumber$
      .subscribe(res => {
        if (res.type === METAMASK.INSTALL) {
          this._openModalInstallMetaMask(ModalInstallMetamaskComponent, true, false);
        }

        if (res.type === METAMASK.LOGIN) {
          this._openModalInstallMetaMask(ModalInstallMetamaskComponent, false, true);
        }
      });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  private _openModalInstallMetaMask(comp, isInstall: boolean, isLogin: boolean) {
    const _opts: ModalOptions = {
      class: 'modal-md',
      backdrop: true,
      ignoreBackdropClick: true,
      initialState: {
        isInstall: isInstall,
        isLogin: isLogin
      }
    };

    this._openModalWithComponent(comp, _opts)
  }

  private _openModalVersion(comp) {
    const _opts = {
      class: 'modal-md'
    };

    this._openModalWithComponent(comp, _opts)
  }

  private _openModalWithComponent(comp, opts?: ModalOptions) {
    this._modalService.show(comp, opts);
  }
}
