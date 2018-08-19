export const getters = {
    web3Init(state) {
        return state;
    },
    account: state => state.account,
    isAccount(state) {
        return state.account && state.account.address;
    }
};
//# sourceMappingURL=getters.js.map