<script setup lang="ts">
    import { defineProps, ref } from 'vue';
    import BodyCell from './BodyCell.vue';
    import DetailRowToggle from './DetailRowToggle.vue';

    const props = defineProps(['columns', 'row', 'detail']);
    const showDetail = ref(false);

    function toggleDetail() {
        
        showDetail.value = !showDetail.value;
        console.log(`TOGGLE: ${showDetail.value}`);
    }
</script>

<template>
    <tr>
        <DetailRowToggle v-if="props.detail" :showing="showDetail" @click="toggleDetail" />
        <body-cell v-for="column in props.columns" :key="column.label" :column="column" :row="row"></body-cell>
    </tr>
    <tr v-if="props.detail && showDetail" class="detail">
        <td colspan="10000" class="detail">
            <component :is="props.detail" :row="props.row" />
        </td>
    </tr>
</template>

<style scoped>
    tr {
        height: 52px;
        font-size: 14px;
        font-weight: 400;
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    }

    tr:last-of-type {
        border-bottom: none;
    }

    tr.detail {
        height: auto;
    }

    td.detail {
        padding: 0;
    }
</style>