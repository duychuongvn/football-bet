import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { SolobetService, NotifyService } from "service/service";

@Component({
  selector: 'app-accept-odds-modal',
  templateUrl: './accept-odds-modal.component.html',
  styleUrls: ['./accept-odds-modal.component.css']
})
export class AcceptOddsModalComponent implements OnInit {

  public title: string;
  public btnSubmit: string;

  constructor(
    private _bsModalService: BsModalService,
    private _bsModalRef: BsModalRef,
    private _solobetService: SolobetService,
    private _notify: NotifyService
  ) { }

  ngOnInit() {
  }

  public close(reason?: string) {
    this._bsModalService.setDismissReason(reason);
    this._bsModalRef.hide();
  }
}
