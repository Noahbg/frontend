<template>
    <div class="mb-4">
        <alert type="info" icon="info-circle" :title="['server.wipe.note']" />
    </div>

    <container title="server.wipe.map_wipe">
        <template #container-header-extra>
            <div class="inline pl-2">
                <fa class="text-white/50 inline" v-tippy="'server.wipe.map_wipe_description'" :icon="['fas', 'circle-info']"
                    size="sm" fixed-width />
            </div>
        </template>

        <!-- TODO: confirmation-modal component -->
        <v-button color="danger" permission="file.delete" class="mt-3 w-full" @click="mapWipe" spinner>
            <t path="server.wipe.map_wipe" />
        </v-button>
    </container>

    <container title="server.wipe.full_wipe" class="mt-10">
        <template #container-header-extra>
            <div class="inline pl-2">
                <fa class="text-white/50 inline" v-tippy="'server.wipe.full_wipe_description'"
                    :icon="['fas', 'circle-info']" size="sm" fixed-width />
            </div>
        </template>

        <!-- TODO: confirmation-modal component -->
        <v-button color="danger" permission="file.delete" class="mt-3 w-full" @click="fullWipe" spinner>
            <t path="server.wipe.full_wipe" />
        </v-button>
    </container>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { dispatch, state } from '~/core';
import { useService } from '~/plugins';

export default defineComponent({
    setup() {
        return {
            mapWipe: () => useService('wipe@map', true)
                .then(() => {
                    dispatch('alerts/add', {
                        type: 'success',
                        title: ['server.wipe.server_wiped'],
                    });
                }),

            fullWipe: () => useService('wipe@full', true)
                .then(() => {
                    dispatch('alerts/add', {
                        type: 'success',
                        title: ['server.wipe.server_wiped'],
                    });
                }),
        };
    },
});
</script>
