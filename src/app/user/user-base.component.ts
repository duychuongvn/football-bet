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
    protected bsModalService: BsModalService
  ) {}

  ngOnInit() {
    this.addUserType();
    this.getUserMatches();
  }

  protected getUserMatches() {
    MATCHES.filter((item: UserInterface) => {
      this.userMatches.push(new User(item));
    });
  }

  protected addUserType() {
    for(let i in this.userTypeOpts) {
      this.arrUserType.push({
        id: i,
        text: this.userTypeOpts[i],
        number: '+99'
      });
    }
  }

  protected isActiveFilter(type) {
    return this.userTypeSelect === this.userTypeOpts[type];
  }

  protected selectedType(type) {
    this.userTypeSelect = this.userTypeOpts[type];
  }

  protected openModalComponent(comp, modalOptions: ModalOptions) {
    this.bsModalService.show(comp, modalOptions);
  }
}
