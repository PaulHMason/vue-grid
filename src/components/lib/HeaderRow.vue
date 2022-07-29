<script setup lang="ts">
    import { defineProps, defineEmits, onMounted, ref } from 'vue';
    import HeaderCell from './HeaderCell.vue';
    import RowSelector from './RowSelector.vue';

    const emit = defineEmits(['sort']);
    const props = defineProps(['columns', 'detail', 'spacers', 'selectionMode', 'selectionState', 'sortBy', 'sortDesc', 'renderKey']);
    const el = ref(null);

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

    function recalc() {
        if (el.value) {
            const fixed = (el.value as HTMLElement).querySelectorAll('.fixed');
            let prev: any = null;
            let offset = 0;

            fixed.forEach((f: any, i: number) => {
                if (prev) {
                    const rect = prev.getBoundingClientRect();
                    f.style.left = `${rect.right - offset}px`;
                    f.style.zIndex = 999;
                } else {
                    const rect = f.getBoundingClientRect();
                    offset = rect.left;
                }

                if (i === fixed.length - 1) {
                    f.classList.add('separator');
                }

                prev = f;
            });
        }
    }

    onMounted(() => {
        recalc();
    });
</script>

<template>
    <tr ref="el">
        <th v-if="props.selectionMode !== 'none'" class="fixed separator">
            <RowSelector v-if="props.selectionMode === 'multiple'" :selected="props.selectionState !== 'none'" :indeterminate="props.selectionState === 'some'" @select="toggleSelection" />
        </th>
        <th v-if="props.detail" class="fixed"></th>
        <th v-for="column in props.columns" :key="column.label" :class="column.freeze ? 'fixed' : ''">
            <header-cell :column="column" @sort="handleSort" :sort-by="sortBy" :sort-desc="sortDesc" />
        </th>
        <th class="filler"></th>
    </tr>
</template>

<style scoped>
    tr {
        height: var(--table-header-height);
        user-select: none;
    }

    th {
        position: sticky;
        top: 0;
        z-index: 998;
        background-color: var(--table-fixed-color);
        border-bottom: 1px solid var(--table-separator-color);
    }

    th:first-child {
        left: 0;
        z-index: 999;
    }

    .filler {
        width: 99%;
    }

    .separator {
        border-right: 1px solid var(--table-separator-color);
    }

/*
    .fixed {
        padding: 0;
        border-right: 1px solid var(--table-separator-color);
    }
    */
</style>