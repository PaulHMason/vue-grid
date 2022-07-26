<script setup lang="ts">
    import { defineProps } from 'vue';
    import SvgIcon from '../visualizers/SvgIcon.vue';
    const props = defineProps(['showing']);
</script>

<template>
    <td>
        <div class="container">
            <svg-icon :icon="props.showing ? 'chevron-down' : 'chevron-right'" />
        </div>
    </td>
</template>

<style scoped>
    td {
        padding: 1px;
        cursor: pointer;
        background-color: #FAFAFA;
        border-right: 1px solid rgba(0, 0, 0, 0.12);
    }

    .container {
        width: var(--table-spacer-size);
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>