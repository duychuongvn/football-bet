import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventEmitterService } from 'service/service';

import { Account } from 'models/account';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {

  public isOpen = false;
  public account: Account = new Account();

  private _loadInfor;

  constructor(
    private _eventEmitter: EventEmitterService
  ) { }

  ngOnInit() {
    this._loadInfor = this._eventEmitter.caseNumber$
      .subscribe(res => {
        if (res.type === 'account-infor-open') {
          this.isOpen = true;
          this.account = res.data.account;

          console.log(this.account);
        }
      })
  }

  ngOnDestroy() {
    this._loadInfor.unsubscribe();
  }

  public closeSidebar() {
    this.isOpen = false;
  }
}
