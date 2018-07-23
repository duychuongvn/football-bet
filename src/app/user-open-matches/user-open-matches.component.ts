import { Component, Inject, NgZone } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { UserBaseComponent } from 'app/user/user-base.component';
import { USER_TYPE_OPEN } from 'enums/user';

import { ModalUserCancelComponent } from '../modal-user-cancel/modal-user-cancel.component';

import { UserOdds } from 'models/user-odds';

@Component({
  selector: 'app-user-open-matches',
  templateUrl: './user-open-matches.component.html',
  styleUrls: ['./user-open-matches.component.scss']
})
export class UserOpenMatchesComponent extends UserBaseComponent {

  constructor(
    @Inject(BsModalService) _bsModalService: BsModalService
  ) {
    super(_bsModalService);

    this.userTypeSelect = USER_TYPE_OPEN.MATCH_ALL;
    this.userTypeOpts = USER_TYPE_OPEN;
  }

  public openCancel(match: UserOdds) {
    const _opts: ModalOptions = {
      class: 'modal-sm',
      ignoreBackdropClick: true,
      animated: true,
      initialState: {
        match: match
      }
    };

    this.openModalComponent(ModalUserCancelComponent, _opts);
  }
}
