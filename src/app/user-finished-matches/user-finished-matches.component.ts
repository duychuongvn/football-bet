import { Component, Inject } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { UserBaseComponent } from 'app/user/user-base.component';
import { USER_TYPE_FINISHED } from 'enums/user';

import { UserOdds } from 'models/user-odds';

import { ModalUserCancelComponent } from '../modal-user-cancel/modal-user-cancel.component';

@Component({
  selector: 'app-user-finished-matches',
  templateUrl: './user-finished-matches.component.html',
  styleUrls: ['./user-finished-matches.component.scss']
})
export class UserFinishedMatchesComponent extends UserBaseComponent{

  constructor(
    @Inject(BsModalService) _bsModalService: BsModalService
  ) {
    super(_bsModalService);

    this.userTypeSelect = USER_TYPE_FINISHED.MATCH_ALL;
    this.userTypeOpts = USER_TYPE_FINISHED;
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
