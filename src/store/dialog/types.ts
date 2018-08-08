export interface DialogState {
  isStartLoading: boolean,
  isHowItWork: boolean,
  isOddsCancel: boolean,
  isMetaMask: boolean,
  isStoreBetting: boolean,
  isSharingBetting: boolean,
  initData?: any,
  dialogName: string
}

export interface DialogStatus {
  key: string,
  isOpen: boolean,
  name: string
}