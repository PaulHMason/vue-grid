<script setup lang="ts">
    import { defineProps, onMounted, onUpdated, ref } from 'vue';
    import HeaderCell from './HeaderCell.vue';
    import RowSelector from './RowSelector.vue';

    const props = defineProps(['columns', 'detail', 'spacers', 'selectionMode', 'selectionState', 'sortBy', 'sortDesc', 'reorderColumns', 
        'columnSizing', 'updateKey']);
    const el = ref(null);
    const layoutKey = ref(0);

    let columnResizing = false;
    let resizeColumn1: any = null;
    let resizeColumn1El: any = null;
    let resizer: any = null;
    let prevResizeX = 0;

    function updateLayout() {
        if (layoutKey.value > 1000000) {
            layoutKey.value = 0;
        } else {
            layoutKey.value += 1;
        }
    }

    function toggleSelection(selected: any) {
        const event = new CustomEvent('rowselectall', { 
            detail: {
                selected: selected
            }
        });
        dispatchEvent(event);
    }

    function updateSpacers() {
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
        updateSpacers();
    });

    onUpdated(() => {
        updateSpacers();
    });

    function dragOver(e: any, id: string) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    function drop(e: any, id: string) {
        e.preventDefault();
        const src = e.dataTransfer.getData('text/plain');
        const event = new CustomEvent('movecolumn', { 
            detail: {
                src: src,
                dest: id
            }
        });
        dispatchEvent(event);
    }

    function columnResizeEnd(e: any) {
        if (columnResizing) {
            columnResizing = false;
            resizeColumn1.width = `${resizeColumn1El.getBoundingClientRect().width}px`;
            resizeColumn1 = null;
            resizeColumn1El = null;
            resizer.removeAttribute('resizing');

            document.removeEventListener('mousemove', columnResizeStep);
            document.removeEventListener('mouseup', columnResizeEnd);
            document.removeEventListener('touchmove', columnResizeStep);
            document.removeEventListener('touchend', columnResizeEnd);
        }
    }

    function columnResizeStep(e: any) {
        if (columnResizing) {
            const dx = e.screenX - prevResizeX;
            prevResizeX = e.screenX;

            requestAnimationFrame(() => {
                resizeColumn1El.style.width = `${resizeColumn1El.clientWidth + dx}px`;
                const event = new CustomEvent('columnresized');
                dispatchEvent(event);
            });
        }
    }

    function columnResizeStart(e: any, columnIndex: any) {
        prevResizeX = e.screenX;
        resizer = e.target;
        resizer.setAttribute('resizing', '');
        resizeColumn1 = props.columns[columnIndex];
        resizeColumn1El = resizer.previousElementSibling;
        columnResizing = true;

        document.addEventListener('mousemove', columnResizeStep);
        document.addEventListener('mouseup', columnResizeEnd);
        document.addEventListener('touchmove', columnResizeStep);
        document.addEventListener('touchend', columnResizeEnd);
    }

    function getColumnStyle(column: any): string | undefined {
        if ((props.columnSizing !== 'auto') && (column.width)) {
            return `width: ${column.width};`;
        }

        return undefined;
    }
</script>

<template>
    <tr data-row ref="el">
        <th v-if="props.selectionMode !== 'none'" class="fixed">
            <RowSelector class="separator" v-if="props.selectionMode === 'multiple'" :selected="props.selectionState !== 'none'"
                :indeterminate="props.selectionState === 'some'" @select="toggleSelection" />
        </th>
        <th v-if="props.detail" class="fixed"></th>
        <th v-for="(column, columnIndex) in props.columns.filter((c: any) => !c.hide)" :key="column.id" :class="column.freeze ? 'fixed' : ''"  
            @dragover="(props.reorderColumns && !column.freeze) ? dragOver($event, column.id) : null" 
            @drop="(props.reorderColumns && !column.freeze) ? drop($event, column.id) : null">
            <header-cell :column="column" :sort-by="sortBy" :sort-desc="sortDesc" :reorder-columns="props.reorderColumns" :style="getColumnStyle(column)" :key="layoutKey"></header-cell>
            <div v-if="props.columnSizing === 'resizable'" class="resizer" @mousedown="columnResizeStart($event, columnIndex)" @touchstart="columnResizeStart($event, columnIndex)"></div>
        </th>
        <th class="filler" @dragover="props.reorderColumns ? dragOver($event, '') : null" @drop="props.reorderColumns ? drop($event, '') : null"></th>
    </tr>
</template>

<style scoped>
    tr {
        height: var(--table-header-height);
        user-select: none;
    }

    th {
        position: sticky;
        padding: 0;
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
        height: var(--table-header-height);
    }

    .resizer {
        position: absolute;
        right: 0;
        top: 0;
        width: 3px;
        height: var(--table-header-height);
        cursor: col-resize;
    }

    .resizer:hover, .resizer[resizing] {
        background-color: var(--table-resizer-color);
    }
</style>