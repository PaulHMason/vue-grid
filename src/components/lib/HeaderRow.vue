<script setup lang="ts">
    import { defineProps, defineEmits } from 'vue';
    import HeaderCell from './HeaderCell.vue';
    import RowSpacer from './RowSpacer.vue';
    import RowSelector from './RowSelector.vue';

    const emit = defineEmits(['sort']);
    const props = defineProps(['columns', 'detail', 'spacers', 'selectionMode', 'selectionState']);

    function handleSort(columnId: string) {
        emit('sort', columnId);
    }

    function toggleSelection(selected: any) {
        const event = new CustomEvent('rowselectall', { 
            detail: {
                selected: selected
            }
        });
        dispatchEvent(event);
    }
</script>

<template>
    <tr>
        <th v-if="props.selectionMode !== 'none'" class="detail-filler">
            <RowSelector v-if="props.selectionMode === 'multiple'" :selected="props.selectionState !== 'none'" :indeterminate="props.selectionState === 'some'" @select="toggleSelection" />
        </th>
        <th v-if="props.detail"><RowSpacer /></th>
        <th v-for="i in props.spacers" :key="i"><RowSpacer /></th>
        <header-cell v-for="column in props.columns" :key="column.label" :column="column" @sort="handleSort" />
        <th class="filler"></th>
    </tr>
</template>

<style scoped>
    tr {
        height: var(--table-header-height);
        background-color: #FAFAFA;
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
        user-select: none;
    }

    .detail-filler {
        padding: 0;
        box-sizing: border-box;
        border-right: 1px solid rgba(0, 0, 0, 0.12);
    }

    .filler {
        width: 99%;
    }
</style>