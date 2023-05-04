<template>
    <div class="mb-4" v-if="status != 'ok'">
        <alert type="danger" icon="info-circle"
            :title=status />

        <div class="mt-4 flex items-center" v-if="status == 'You must link to discord to use the Loading Screen tool.'">
            <a href="/account" class="btn btn-primary mx-auto">Link Discord</a>
        </div>
    </div>

    <div v-if="loadingScreenResponse != null" class="w-full h-[70vh]">
        <iframe :src="loadingScreenResponse" class="w-full h-full rounded-md"></iframe>
    </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import { ref } from 'vue';
import { LoadingScreenService } from 'src/api/services/client/loadingScreen';

export default defineComponent({
    components: {},
    setup() {
        let service = new LoadingScreenService();
        let loadingScreenResponse = ref("");
        let status = ref("ok");

        service.get().then((response) => {
            loadingScreenResponse.value = response.url ?? null;
            status.value = response.status ?? "unknown";
        });

        return {
            loadingScreenResponse,
            status
        };
    },
});
</script>
