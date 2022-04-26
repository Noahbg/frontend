import { RouteLocationNormalized } from 'vue-router';
import { Logger, dispatch, state } from '~/core';
import { TranslatableError } from '~/errors';
import * as Namespaces from '~/api/services';

// Fetches relevant models in the route parameters automatically. Works by checking if [parameter]Service has a `get` method,
// indicating it's a route model. Uses the model's `getRouteID()` method to verify if the model has changed and should be refetched.
export class ModelBindings implements Middleware {
    name() {
        return `model_bindings(${this.namespace})`;
    }

    private toDelete: string[] = [];
    constructor(private namespace: string) {}

    async run(to: RouteLocationNormalized, from: RouteLocationNormalized) {
        this.toDelete = [];

        const models: { id: string, name: string, get: () => Promise<any> }[] = [];
        for(const paramKey in to.params) {
            const serviceName = `${paramKey.substring(0, 1).toUpperCase() + paramKey.substring(1)}sService`;
            const service = (Namespaces as Record<string, any>)[this.namespace]?.[serviceName];
            if (service) {
                const getMethod = service.get;
                if (getMethod) {
                    models.push({
                        id: to.params[paramKey].toString(),
                        name: paramKey,
                        get: getMethod,
                    });
                } else {
                    Logger.debug('ModelBindings', `Detected a possible model binding '${paramKey}', but it seems to have no 'get' method...?`);
                }
            }
        }

        // If model binding switches in between requests (admin <-> client), this.namespace will always cause it to be the new
        // route's namespace and thus never trigger a refresh.
        const namespace = from.name?.toString().split('.').shift() || this.namespace;

        const currentModels = models.map(a => a.name);
        this.toDelete = Object.keys(state.models).filter(name => name !== '_refreshFuncs' && !currentModels.includes(name));
        const modelsToFetch = models.filter(model => {
            return !state.models[model.name] || state.models[model.name]?.getRouteID(namespace) !== model.id;
        });

        Logger.debug('ModelBindings', `The following state changes will happen: fetch [${modelsToFetch.map(a => a.name).join(', ')}], delete [${this.toDelete.join(', ')}], final [${models.map(a => a.name).join(', ')}]`);

        modelsToFetch.map(async model => {
            const finished = await dispatch('loading/add', `ModelBindings@${model.name}`);

            return model.get()
                .then(result => dispatch('models/set', {
                    name: model.name,
                    model: result,
                    refresh: model.get.bind(this),
                }))
                .catch(err => {
                    if (err instanceof TranslatableError) dispatch('alerts/add', err.getDisplayError());
                })
                .finally(() => finished());
        });
    }

    async postRun() {
        this.toDelete.forEach(name => dispatch('models/clear', name));
        this.toDelete = [];
    }
}
