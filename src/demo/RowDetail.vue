<script setup lang="ts">
    import { defineProps } from 'vue';

    const props = defineProps(['row']);
</script>

<template>
    <div>DETAIL</div>
</template>

<style scoped>
    div {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 64px;
        background-color: lavender;
    }
</style>