import { App } from 'vue';
import { Router } from 'vue-router';
import * as Sentry from '@sentry/vue';
import { BrowserTracing } from '@sentry/tracing';
import { Logger } from '~/core';

export function enableSentry(app: App, router: Router) {
    Logger.debug('Sentry', 'Enabling itself...');

    // TODO: provide additional metadata, e.g. current version
    Sentry.init({
        app,
        dsn: 'https://5349164b6c7445038ff6cad0308d5bcc@sentry.physgun.com/7',
        integrations: [
            new BrowserTracing({
                routingInstrumentation: Sentry.vueRouterInstrumentation(router),
                tracingOrigins: [`//${location.host}/api/`],
            }),
        ],
        tracesSampleRate: 0.1,

        logErrors: true,
        ignoreErrors: [
            'Request aborted',
            'TranslatableError: ',
        ],
    });
}
