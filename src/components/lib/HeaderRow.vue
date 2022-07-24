<script setup lang="ts">
    import { defineProps } from 'vue';
    import HeaderCell from './HeaderCell.vue';
    import RowSpacer from './RowSpacer.vue';

    const props = defineProps(['columns', 'detail', 'spacers']);
</script>

<template>
    <tr>
        <th v-if="props.detail" class="detail-filler"></th>
        <th v-for="i in props.spacers" :key="i"><RowSpacer /></th>
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
        width: 48px;
        border-right: 1px solid rgba(0, 0, 0, 0.12);
    }
</style>