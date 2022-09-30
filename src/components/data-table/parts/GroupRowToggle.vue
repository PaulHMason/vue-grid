<script setup lang="ts">
    import { defineProps } from 'vue';
    import SvgIcon from '../../svg-icon/SvgIcon.vue';
    const props = defineProps(['showing']);
</script>

<template>
    <div tabindex="0" class="container">
        <svg-icon :icon="props.showing ? 'chevron-down' : 'chevron-right'" />
    </div>
</template>

<style scoped>
    .container {
        display: flex;
        min-width: var(--table-spacer-size);
        width: var(--table-spacer-size);
        height: var(--table-row-height);
        align-items: center;
        justify-content: center;
    }

    .container:focus {
        outline: 2px solid var(--table-focus-color);
        outline-offset: -6px;
    }
</style>