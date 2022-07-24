<script setup lang="ts">
    import { defineProps } from 'vue';
    import HeaderCell from './HeaderCell.vue';

    const props = defineProps(['columns', 'detail']);
</script>

<template>
    <tr>
        <th v-if="props.detail" class="detail-filler"></th>
        <header-cell v-for="column in props.columns" :key="column.label" :column="column"></header-cell>
    </tr>
</template>

<style scoped>
    tr {
        height: 56px;
        font-size: 14px;
        background-color: #FAFAFA;
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    }

    .detail-filler {
        padding: 1px 16px;
        border-right: 1px solid rgba(0, 0, 0, 0.12);
    }
</style>