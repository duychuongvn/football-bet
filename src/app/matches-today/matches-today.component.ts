import { Component, Inject } from '@angular/core';
import { JhelperService } from 'service/service';

import { HomeBaseComponent } from 'app/home/home-base.component';

import * as moment from 'moment';

@Component({
  selector: 'app-matches-today',
  templateUrl: './matches-today.component.html',
  styleUrls: ['./matches-today.component.scss']
})
export class MatchesTodayComponent extends HomeBaseComponent {

  constructor(
    @Inject(JhelperService) _helper: JhelperService,
  ) {
    super(_helper);

    this.helper
    this.currentDate = moment().local();
  }
}
