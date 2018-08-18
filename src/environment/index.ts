export default {
  DOMAIN: process.env.DOMAIN,
  APP_VERSION: '',
  APP_OLD_VERSION: '',
  APP_KEY: 'Idgz1PE3zO9iNc0E3oeH3CHDPX9MzZe3',
  API: {
    PATH: 'http://35.237.147.94:8080/api/',
    PATH_IPFS: 'https://ipfs.io/ipfs/',
    EMULATE_JSON: false,
    EMULATE_HTTP: true,
    AUTHORIZATION: 'Authorization',
    BEARER: 'Bearer '
  },
  FIREBASE: {
    API_KEY: 'AIzaSyAAv-bcd045ge59uQkuPHINeR3ssOxHWE4',
    AUTH_DOMAIN: 'vuejs-bether.firebaseapp.com',
    DATABASE_URL: 'https://vuejs-bether.firebaseio.com',
    PROJECT_ID: 'vuejs-bether',
    STORAGE_BUCKET: 'vuejs-bether.appspot.com',
    MESSAGING_SENDER_ID: '47611469942'
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
  CONTRACT_ADDRESS: '0x345ca3e014aaf5dca488057592ee47305d9b3e10'
}
