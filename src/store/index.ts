import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import { RootState } from '@/store/types'
import { web3 } from '@/store/web3'
import { solobet } from '@/store/solobet'
import { fixture } from '@/store/fixture'
import { matches } from '@/store/matches'
import { betting } from '@/store/betting'
import { dialog } from '@/store/dialog'
import { odds } from '@/store/odds'
import { notify } from '@/store/notify'
import { firebase } from '@/store/firebase'

Vue.use(Vuex)

const storeOptions: StoreOptions<RootState> = {
  state: {
    version: '1.0.0' // a simple property
  },
  modules: {
    web3,
    solobet,
    fixture,
    matches,
    betting,
    dialog,
    odds,
    notify,
    firebase
  }
}

export const store = new Vuex.Store<RootState>(storeOptions)
