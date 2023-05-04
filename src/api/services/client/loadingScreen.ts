import RequestService from './request';

interface LoadingScreenResponse {
    url: string;
    status?: string;
    mustLinkDiscord: boolean;
}

class LoadingScreenService {
    get(): Promise<LoadingScreenResponse> {
        return RequestService.post('/servers/:server/loading-screen');
    }
}

export {
    LoadingScreenService,
    LoadingScreenResponse,
}
