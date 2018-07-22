import { OnInit, Injectable } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

import { User } from 'models/user';
import { UserInterface } from 'interfaces/user';

import { MATCHES, SORTODDS_OPTS, SORTODDS_CHILD_OPTS } from './data';

@Injectable()
export abstract class UserBaseComponent implements OnInit {

  protected userTypeSelect: string = '';
  protected userTypeOpts: Object = {};
  protected arrUserType: Array<Object> = [];

  protected userMatches: User[] = [];

  protected oddsOpts = SORTODDS_OPTS;

  protected oddsChildOpts = SORTODDS_CHILD_OPTS.date;

  protected sortBySelected = 1;
  protected sortBySelected1 = 1;

  constructor(
    protected _bsModalService: BsModalService
  ) {}

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
    for(let i in this.userTypeOpts) {
      this.arrUserType.push({
        id: i,
        text: this.userTypeOpts[i],
        number: '+99'
      });
    }
  }

  public isActiveFilter(type) {
    return this.userTypeSelect === this.userTypeOpts[type];
  }

  public selectedType(type) {
    this.userTypeSelect = this.userTypeOpts[type];
  }

  protected openModalComponent(comp, modalOptions: ModalOptions) {
    this._bsModalService.show(comp, modalOptions);
  }
}
