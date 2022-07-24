<script setup lang="ts">
    import { defineProps } from 'vue';

    const props = defineProps(['column']);
</script>

<template>
    <th>{{props.column.label}}</th>
</template>

<style scoped>
    th {
        padding: 1px 16px;
        font-weight: 500;
        white-space: nowrap;
        background-color: #FAFAFA;
    }
</style>