import RequestService from './request';

class WipeService {
    map(): Promise<void> {
        return RequestService.post('/servers/:server/wipe/map');
    }
    full(): Promise<void> {
        return RequestService.post('/servers/:server/wipe/full');
    }
}

export default new WipeService();
