import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-sharing-bet',
  templateUrl: './modal-sharing-bet.component.html',
  styleUrls: ['./modal-sharing-bet.component.scss']
})
export class ModalSharingBetComponent implements OnInit {

  constructor(
    private _bsModalRef: BsModalRef,
  ) { }

  ngOnInit() {
  }

  public close() {
    this._bsModalRef.hide();
  }

}
