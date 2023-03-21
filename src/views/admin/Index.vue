<template>
    <div>
        <container title="admin.index.instance_overview">
            <i18n-t keypath="admin.index.current_version" tag="h2">
                <template #version>
                    <code>{{ version }}</code>
                </template>
            </i18n-t>
        </container>
    </div>
</template>

<style lang="scss" scoped>
ul li::after {
    content: ', ';
}
</style>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
    setup() {
        return {
            version: computed(() => window.Wisp.Version || 'unknown'),
        };
    }
});
</script>
