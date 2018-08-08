import { GetterTree } from 'vuex';
import { RootState } from '@/store/types';

export const getters: GetterTree<any, RootState> = {
  isStartLoading: state => state.isStartLoading,
  isHowItWork: state => state.isHowItWork,
  isOddsCancel: state => state.isOddsCancel,
  isMetaMask: state => state.isMetaMask,
  isStoreBetting: state => state.isStoreBetting,
  isSharingBetting: state => state.isSharingBetting,
  initData: state => state.initData,
  dialogName: state => state.dialogName
};