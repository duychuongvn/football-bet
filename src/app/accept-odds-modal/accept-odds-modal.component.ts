import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { SolobetService, NotifyService } from 'service/service';
import { Betting } from 'models/betting';
import { Fixture } from 'models/fixture';


@Component({
  selector: 'app-accept-odds-modal',
  templateUrl: './accept-odds-modal.component.html',
  styleUrls: ['./accept-odds-modal.component.scss']
})
export class AcceptOddsModalComponent implements OnInit {

  constructor(
    private _bsModalService: BsModalService,
    private _bsModalRef: BsModalRef,
    private _solobetService: SolobetService,
    private _notify: NotifyService
  ) { }

  ngOnInit() { }

  public close(reason?: string) {
    this._bsModalService.setDismissReason(reason);
    this._bsModalRef.hide();
  }
}
