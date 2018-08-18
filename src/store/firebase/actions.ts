import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';

import EVN from '@/environment';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/messaging';
import 'firebase/database';

import { INIT_FIREBASE, INIT_FIREBASE_ADMIN } from '@/store/mutations';

export const actions: ActionTree<any, RootState> = {
  initFireBase: ({commit}) => {
    const _fbConfig = {
      apiKey: EVN.FIREBASE.API_KEY,
      authDomain: EVN.FIREBASE.AUTH_DOMAIN,
      databaseURL: EVN.FIREBASE.DATABASE_URL,
      projectId: EVN.FIREBASE.PROJECT_ID,
      // storageBucket: EVN.FIREBASE.STORAGE_BUCKET,
      messagingSenderId: EVN.FIREBASE.MESSAGING_SENDER_ID,
      serviceAccount: './92a7751980.json'
    }

    firebase.initializeApp(_fbConfig)

    commit(INIT_FIREBASE, firebase)
  },
  initFbAdmin: ({commit}) => {
    // const _config = {
    //   credential: firebaseAdmin.credential.applicationDefault(),
    //   databaseURL: EVN.FIREBASE.DATABASE_URL
    // };

    // firebaseAdmin.initializeApp()

    // commit(INIT_FIREBASE_ADMIN, firebaseAdmin)
  },
  sendNotify: async ({commit}) => {

    if('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(function() {
          return navigator.serviceWorker.ready;
        }).then(function(registration) {
          registration.pushManager.subscribe({userVisibleOnly: true}).then(function(sub) {
            var endpointSections = sub.endpoint.split('/');
            var subscriptionId = endpointSections[endpointSections.length - 1];
            var newKey = firebase.database().ref().child('token').push().key;
            firebase.database().ref('token/' + newKey).set({subscriptionId: subscriptionId});
            console.log('endpoint:', subscriptionId);
          });
        });
      navigator.serviceWorker.ready.then(function(registration) {
        console.log('Service Worker Ready');
      });
    }



    const message = {
      notification: {
        title: 'My Title',
        body : 'TEST'
      },
      condition: "'stock-GOOG' in topics || 'industry-tech' in topics"
    };

  }
};
