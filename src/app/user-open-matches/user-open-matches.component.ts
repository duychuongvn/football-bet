import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { USER_TYPE_OPEN } from 'enums/user';

import { User } from 'models/user';
import { UserOdds } from 'models/user-odds';
import { UserInterface } from 'interfaces/user';

import { ModalUserCancelComponent } from 'app/modal-user-cancel/modal-user-cancel.component';

import { MATCHES } from './data';

@Component({
  selector: 'app-user-open-matches',
  templateUrl: './user-open-matches.component.html',
  styleUrls: ['./user-open-matches.component.scss']
})
export class UserOpenMatchesComponent implements OnInit {

  private _userTypeSelect: string = USER_TYPE_OPEN.MATCH_ALL;
  public arrUserType: Array<Object> = [];

  public userMatches: User[] = [];

  constructor(
    private _bsModalService: BsModalService
  ) { }

  ngOnInit() {
    this.addUserType();
    this._getUserMatches();
  }

  private _getUserMatches() {
    MATCHES.filter((item: UserInterface) => {
      this.userMatches.push(new User(item));
    });
  }

  public addUserType() {
    for(let i in USER_TYPE_OPEN) {
      this.arrUserType.push({
        id: i,
        text: USER_TYPE_OPEN[i],
        number: '+99'
      });
    }
  }

  public isActiveFilter(type) {
    return this._userTypeSelect === USER_TYPE_OPEN[type];
  }

  public selectedType(type) {
    this._userTypeSelect = USER_TYPE_OPEN[type];
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

    this._openModalComponent(ModalUserCancelComponent, _opts);
  }

  private _openModalComponent(comp, modalOptions: ModalOptions) {
    this._bsModalService.show(comp, modalOptions);
  }
}
