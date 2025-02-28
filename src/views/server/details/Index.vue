<template>
    <div>
        <container title="server.details.server_name">
            <v-form service-id="server@updateDetails" on-success="server.details.updated">
                <v-input name="server_name" :value="server?.name" footer="server.details.name_description" rule="required|max:32" hide-label />

                <div class="text-right">
                    <v-submit class="px-6 py-3" color="primary" label="server.details.update_server_name" permission="details.update" />
                </div>
            </v-form>
        </container>

        <div class="flex flex-wrap lg:flex-nowrap gap-x-4 my-4">
            <container class="w-full lg:w-1/2" title="server.details.server_limits">
                <div class="flex flex-wrap gap-y-6 align-center">
                    <details-attribute icon="server" name="generic.server.name" :value="server?.name" />
                    <details-attribute icon="tachometer-alt" name="generic.server.cpu" :value="limits?.cpu ? `${limits?.cpu} %` : '∞'" />
                    <details-attribute icon="memory" name="generic.server.memory" format-unit :value="limits?.memory * 1024 * 1024" />
                    <details-attribute icon="hdd" name="generic.server.disk" format-unit :value="limits?.disk * 1024 * 1024" />
                </div>
            </container>

            <container class="w-full lg:w-1/2" title="server.details.server_info">
                <div class="flex flex-wrap gap-y-6 align-center">
                    <details-attribute icon="server" name="generic.server.hostname" :value="query?.name" />

                    <details-attribute v-if="query?.gamemode" icon="gamepad" name="generic.server.gamemode" :value="query?.gamemode" />
                    <details-attribute v-else icon="code-branch" name="generic.server.version" :value="query?.version" />

                    <details-attribute icon="map-marked-alt" name="generic.server.map" :value="query?.map" />
                    <details-attribute icon="users" name="generic.server.players">
                        <t :path="['generic.server.players_amount', { current: query?.players ?? '--', max: query?.maxplayers ?? '--' }]" />
                    </details-attribute>
                    <details-attribute icon="wifi" name="generic.server.ip" :value="server?.primaryAllocation().displayName()" />
                    <details-attribute icon="id-badge" name="generic.uuid">
                        <p v-clipboard>
                            {{ server?.uuidShort }}
                        </p>
                    </details-attribute>
                </div>
            </container>
        </div>

        <container title="generic.server.resource_usage">
            <div class="flex flex-wrap gap-x-6 lg:flex-nowrap">
                <chart class="w-full lg:w-1/2" type="cpu" />
                <chart class="w-full lg:w-1/2" type="memory" />
            </div>
        </container>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { state } from '~/core';
import DetailsAttribute from './DetailsAttribute.vue';

export default defineComponent({
    components: { DetailsAttribute },
    setup() {
        return {
            server: computed(() => state.models.server),
            limits: computed(() => state.models.server?.limits),
            query: computed(() => state.server.socket.query),
        };
    },
});
</script>
