import axios from 'axios'
import ENV from '@/environment/index'
import * as moment from 'moment'

const Rx = require('rx')
const _gateways: Array<String> = [
  'https://ipfs.infura.io/ipfs/:hash',
  'https://ipfs.io/ipfs/:hash',
  'https://gateway.ipfs.io/ipfs/:hash',
  'https://rx14.co.uk/ipfs/:hash',
  'https://xmine128.tk/ipfs/:hash',
  'https://upload.global/ipfs/:hash',
  'https://ipfs.jes.xxx/ipfs/:hash',
  'https://catalunya.network/ipfs/:hash',
  'https://siderus.io/ipfs/:hash',
  'https://www.eternum.io/ipfs/:hash',
  'https://hardbin.com/ipfs/:hash',
  'https://ipfs.macholibre.org/ipfs/:hash',
  'https://ipfs.works/ipfs/:hash',
  'https://ipfs.work/ipfs/:hash',
  'https://ipfs.wa.hle.rs/ipfs/:hash',
  'https://api.wisdom.sh/ipfs/:hash',
  'https://gateway.blocksec.com/ipfs/:hash',
  'https://ipfs.renehsz.com/ipfs/:hash'
]

// Default interceptor private
let api_ipfs: any;

export const IpfsService = {
  checkGateWays: async () => {
    for(let i = 0; i < _gateways.length; i++) {
      const _urlPath: string = _gateways[i].replace(':hash', ENV.API.IPFS_HASHID);
      const _options: Object = { method: 'GET' }

      try {
        return await fetch(_urlPath, _options);
      } catch (err) {
        const isLastAttempt = i + 1 === _gateways.length;
        if (isLastAttempt) throw err;
      }
    }
  },
  initIpfsApi: (url: string) => {
    const _baseUrl = url.replace(ENV.API.IPFS_HASHID, '')
    api_ipfs = axios.create({
      baseURL: _baseUrl,
      timeout: 500000,
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
