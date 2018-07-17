import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

interface DataEmitter {
  type: string;
  data?: any;
}

@Injectable()
export class EventEmitterService {
  // Observable string sources
  private caseNumber = new Subject<any>();
  private matchAnnounced = new Subject<any>();

  // Observable string streams
  public caseNumber$ = this.caseNumber;
  public matchAnnounced$ = this.matchAnnounced;

  // Service message commands
  publishData(data: DataEmitter) {
    this.caseNumber.next(data);
  }

  transferDataToDetail(data: any) {
    this.matchAnnounced.next(data);
  }

}
