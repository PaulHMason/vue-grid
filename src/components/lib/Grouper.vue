<script setup lang="ts">
    import { defineProps } from 'vue';
    import SvgIcon from '../visualizers/SvgIcon.vue';
    const props = defineProps(['groups']);
</script>

<template>
    <div class="grouper-container">
        <div v-for="group in props.groups" :key="group.columnId" class="group-item">
            <svg-icon icon="arrow-up" /><span>{{group.label}}</span><svg-icon icon="cross" />
        </div>
    </div>
</template>

<style scoped>
    .grouper-container {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        box-sizing: border-box;
        gap: 16px;
        height: 64px;
        padding: 0 16px;
        color: rgba(0, 0, 0, 0.87);
        background-color: lightskyblue;
        user-select: none;
    }

    .group-item {
        height: 32px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        border: 1px solid rgba(0, 0, 0, 0.87);
        padding: 8px 8px;
        border-radius: 3px;
        cursor: pointer;
    }
</style>