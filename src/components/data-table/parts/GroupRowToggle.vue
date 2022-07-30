<script setup lang="ts">
    import { defineProps } from 'vue';
    import SvgIcon from '../../svg-icon/SvgIcon.vue';
    const props = defineProps(['showing']);
</script>

<template>
    <div class="container">
        <svg-icon :icon="props.showing ? 'chevron-down' : 'chevron-right'" />
    </div>
</template>

<style scoped>
    .container {
        display: flex;
        width: var(--table-spacer-size);
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
</style>