export interface DialogState {
  isStartLoading: boolean,
  isOddsCancel: boolean,
  isMetaMask: boolean,
  isNetwork: boolean,
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
