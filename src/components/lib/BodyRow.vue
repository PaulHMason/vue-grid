<script setup lang="ts">
import { defineProps, ref } from 'vue';
import BodyCell from './BodyCell.vue';
import DetailRowToggle from './DetailRowToggle.vue';
import RowSpacer from './RowSpacer.vue';
import RowSelector from './RowSelector.vue';

const props = defineProps(['columns', 'row', 'detail', 'spacers', 'selectionMode']);
const showDetail = ref(false);

function toggleDetail() {
    showDetail.value = !showDetail.value;
}

function toggleSelection() {
    props.row.selected = !props.row.selected;
    const event = new CustomEvent('rowselect');
    dispatchEvent(event);
}
</script>

<template>
    <tr>
        <td v-if="props.selectionMode !== 'none'" class="detail-filler">
            <RowSelector :selected="props.row.selected" @select="toggleSelection" />
        </td>
        <DetailRowToggle v-if="props.detail" :showing="showDetail" @click="toggleDetail" />
        <td v-for="i in props.spacers" :key="i">
            <RowSpacer />
        </td>
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
    height: var(--table-body-height);
    font-weight: 400;
    box-sizing: border-box;
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

.spacer {
    width: 48px;
}

.detail-filler {
    padding: 1px;
    box-sizing: border-box;
    background-color: #FAFAFA;
    border-right: 1px solid rgba(0, 0, 0, 0.12);
}
</style>