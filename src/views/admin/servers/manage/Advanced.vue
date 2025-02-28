<template>
    <div class="grid lg:grid-cols-3 gap-x-4 gap-y-4 items-start">
        <container title="admin.servers.advanced.reinstall_server">
            <t path="admin.servers.advanced.reinstall_server_note" />

            <v-button class="w-full mt-4" color="danger" permission="server.reinstall" @click="reinstall" spinner>
                <t path="generic.reinstall" />
            </v-button>
        </container>

        <container title="admin.servers.advanced.install_status">
            <t path="admin.servers.advanced.install_status_note" />

            <v-button class="w-full mt-4" color="info" permission="server.toggle_install" @click="toggleInstall" spinner>
                <t path="generic.toggle" />
            </v-button>
        </container>

        <container title="admin.servers.advanced.rebuild_container">
            <t path="admin.servers.advanced.rebuild_container_note" />

            <v-button class="w-full mt-4" color="primary" permission="server.rebuild" @click="rebuild" spinner>
                Rebuild Server Container
            </v-button>
        </container>

        <container title="admin.servers.advanced.suspend_server">
            <t path="admin.servers.advanced.suspend_server_note" />

            <skeleton :content="16">
                <v-button class="w-full mt-4" color="warning" permission="server.suspend" @click="suspend" spinner>
                    <t :path="`generic.${server.suspended ? 'unsuspend' : 'suspend'}`" />
                </v-button>
            </skeleton>
        </container>

        <container title="admin.servers.advanced.updating_status">
            <t path="admin.servers.advanced.updating_status_note" />

            <v-button class="w-full mt-4" color="info" permission="server.toggle_update" @click="toggleUpdate" spinner>
                <t path="generic.toggle" />
            </v-button>
        </container>

        <container title="admin.servers.advanced.move_server">
            <v-form service-id="servers@move">
                <v-model-select
                    name="location_id"
                    label="components.form.fields.location"
                    service-id="locations@getAll"

                    label-prop="long"
                    value-prop="id"

                    rule="required"

                    v-model:value="selectedLocation"
                />

                <skeleton :content="16">
                    <v-model-select
                        name="node_id"
                        label="components.form.fields.node"
                        service-id="nodes@getAll"

                        label-prop="name"
                        value-prop="id"

                        :key="selectedLocation"
                    />
                </skeleton>

                <v-submit class="w-full" color="danger" permission="server.move">
                    Move server
                </v-submit>
            </v-form>
        </container>

        <container title="admin.servers.advanced.moving_status">
            <t path="admin.servers.advanced.moving_status_note" />

            <v-button class="w-full mt-4" color="warning" permission="server.toggle_move" @click="toggleMove" spinner>
                <t path="generic.toggle" />
            </v-button>
        </container>

        <container title="admin.servers.advanced.reset_mod_statuses">
            <t path="admin.servers.advanced.reset_mod_statuses_note" />

            <v-button class="w-full mt-4" color="danger" permission="server.reset_mods" @click="resetMods" spinner>
                <t path="generic.reset" />
            </v-button>
        </container>

        <container title="admin.servers.advanced.toggle_backup_status">
            <v-form service-id="serverBackups@toggle">
                <skeleton :content="16">
                    <v-model-select
                        name="id"
                        label="components.form.fields.backup"
                        service-id="serverBackups@getAll"

                        label-prop="name"
                        value-prop="id"

                        rule="required"
                    />
                </skeleton>

                <v-submit class="w-full" color="info" permission="server.toggle_backup">
                    <t path="generic.toggle" />
                </v-submit>
            </v-form>
        </container>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { state, dispatch } from '~/core';
import { useService } from '~/plugins';
import { Location } from '~/api/models';

export default defineComponent({
    setup() {
        const selectedLocation = ref<Location>();

        const createAlert = (title: string) => dispatch('alerts/add', {
            type: 'success',
            title: [title],
        });

        return {
            selectedLocation,
            server: computed(() => state.models.server!),

            reinstall: () => useService('servers@reinstall', true).then(() => createAlert('admin.servers.advanced.reinstall_started')),
            toggleInstall: () => useService('servers@toggleInstall', true).then(() => createAlert('admin.servers.advanced.install_toggled')),
            rebuild: () => useService('servers@rebuild', true).then(() => createAlert('admin.servers.advanced.rebuild_requested')),
            suspend: () => useService('servers@suspend', true, { suspended: !state.models.server!.suspended }).then(() => createAlert('admin.servers.advanced.suspend_toggled')),
            toggleUpdate: () => useService('servers@toggleUpdate', true).then(() => createAlert('admin.servers.advanced.updating_toggled')),
            toggleMove: () => useService('servers@toggleMove', true).then(() => createAlert('admin.servers.advanced.moving_toggled')),
            resetMods: () => useService('servers@resetMods', true).then(() => createAlert('admin.servers.advanced.reset_mod_triggered')),
        };
    }
});
</script>
