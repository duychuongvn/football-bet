import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { UserOdds } from 'models/user-odds';

@Component({
  selector: 'app-modal-user-cancel',
  templateUrl: './modal-user-cancel.component.html',
  styleUrls: ['./modal-user-cancel.component.scss']
})
export class ModalUserCancelComponent implements OnInit {

  public match: UserOdds;

  constructor(
    private _bsModalRef: BsModalRef
  ) { }

  ngOnInit() {
  }

  public close() {
    this._bsModalRef.hide();
  }
}
