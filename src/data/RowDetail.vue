<script setup lang="ts">
    import { defineProps } from 'vue';

    const props = defineProps(['row']);
</script>

<template>
    <div>{{row.dessert}}</div>
</template>

<style scoped>
    div {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40px;
        background-color: lightyellow;
    }
</style>