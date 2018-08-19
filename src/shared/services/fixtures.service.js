import { api_serve, api_ipfs } from '@/shared/services/api.service';
export const fixtureService = {
    fixturesHashId() {
        return api_serve.get('fixtures/indexHash');
    },
    fixtures(hashId) {
        return api_ipfs.get(hashId);
    }
};
//# sourceMappingURL=fixtures.service.js.map