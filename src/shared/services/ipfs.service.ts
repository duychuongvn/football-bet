import axios from 'axios'
import ENV from '@/environment/index'
import * as moment from 'moment'

const Rx = require('rx')

// Default interceptor private
let api_ipfs: any;

export const IpfsService = {
  initIpfsApi: () => {
    api_ipfs = axios.create({
      baseURL: ENV.API.PATH_IPFS,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
  },
  getFixture: (hashId: string) => Rx.Observable.create((observer: any) => {
    const _current_date = moment().add(14, 'd').format('YYYY-MM-DD');
    api_ipfs.get(hashId)
      .then((res: any) => {
        const _value = res.data.filter((item : any) => {
          return item.status !== 'FINISHED' && moment(item.utcDate).isSameOrBefore(_current_date)
        });

        observer.onNext(_value);
        observer.onCompleted();
      })
      .catch((error: any) => {
        observer.error(error);
      });
  })
}
