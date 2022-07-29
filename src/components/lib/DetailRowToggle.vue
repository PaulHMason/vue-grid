<script setup lang="ts">
    import { defineProps } from 'vue';
    import SvgIcon from '../visualizers/SvgIcon.vue';
    const props = defineProps(['showing']);
</script>

<template>
    <div class="container">
        <svg-icon :icon="props.showing ? 'chevron-down' : 'chevron-right'" />
    </div>
</template>

<style scoped>
/*
    td {
        cursor: pointer;
        background-color: var(--table-fixed-color);
        border-right: 1px solid var(--table-separator-color);
        border-bottom: 1px solid var(--table-separator-color);
    }
    */

    .container {
        width: var(--table-spacer-size);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
</style>