import { Component, OnInit } from '@angular/core';
import { BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: 'app-modal-install-metamask',
  templateUrl: './modal-install-metamask.component.html',
  styleUrls: ['./modal-install-metamask.component.css']
})
export class ModalInstallMetamaskComponent implements OnInit {

  public isInstall: boolean = false;
  public isLogin: boolean = false;

  constructor(
    private _bsModalRef: BsModalRef
  ) { }

  ngOnInit() {
  }

  public close() {
    this._bsModalRef.hide();
  }
}
