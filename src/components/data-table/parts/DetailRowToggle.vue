<script setup lang="ts">
    import { defineProps } from 'vue';
    import SvgIcon from '../../svg-icon/SvgIcon.vue';
    const props = defineProps(['showing']);
</script>

<template>
    <div tabindex="0" class="container">
        <svg-icon class="toggle-icon" :icon="props.showing ? 'chevron-down' : 'chevron-right'" />
    </div>
</template>

<style scoped>
    .container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--table-spacer-size);
        height: calc(var(--table-body-height) - 1px);
        box-sizing: border-box;
        cursor: pointer;
    }

    .container:focus {
        outline: 1px dashed blue;
        outline-offset: -1px;
    }
</style>