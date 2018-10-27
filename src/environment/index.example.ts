export default {
  DOMAIN: process.env.DOMAIN,
  APP_VERSION: '',
  APP_OLD_VERSION: '',
  APP_KEY: 'xxxxxxxxxxxxxxxxxxxx',
  WALLET_ADDRESS: 'https://etherscan.io/address/',
  API: {
    PATH: 'http://xxxxxxx',
    PATH_IPFS: 'https://xxxxxxxxx',
    EMULATE_JSON: false,
    EMULATE_HTTP: true,
    AUTHORIZATION: 'Authorization',
    BEARER: 'Bearer '
  },
  LANGUAGE: {
    ENGLISH: 'en',
    VIETNAMESE: 'vi'
  },
  CURRENCY: {
    ENGLISH: '$',
    VIETNAMESE: 'VND'
  },
  NOTIFY: {
    SUCCESS: 0,
    ERROR: 1,
    WARNING: 2,
    INFO: 3,
    DURATION: 2000
  },
  CONTRACT_ADDRESS: '0x6f369a76b7879cba678a8005bc6f6259839718bd'
}
