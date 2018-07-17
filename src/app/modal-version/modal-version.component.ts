import { Component, OnInit } from '@angular/core';
import { BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: 'app-modal-version',
  templateUrl: './modal-version.component.html',
  styleUrls: ['./modal-version.component.scss']
})
export class ModalVersionComponent implements OnInit {

  constructor(
    private _bsModalRef: BsModalRef
  ) { }

  ngOnInit() {
  }

  public close() {
    this._bsModalRef.hide();
  }
}
