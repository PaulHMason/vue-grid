<script setup lang="ts">
    import { defineProps, computed } from 'vue';
    import GroupRowToggle from './GroupRowToggle.vue';
    import BodyRow from './BodyRow.vue';
    import SummaryRow from './SummaryRow.vue';
    import TextVisualizer from '../visualizers/TextVisualizer.vue';
    import NumberVisualizer from '../visualizers/NumberVisualizer.vue';
    import BooleanVisualizer from '../visualizers/BooleanVisualizer.vue';
    import DateVisualizer from '../visualizers/DateVisualizer.vue';

    const props = defineProps(['columns', 'row', 'detail', 'spacers', 'selectionMode', 'openGroups', 'showSummary', 'updateKey']);

    const isGroups = computed(() => {
        if (props.row.__items && props.row.__items.length > 0) {
            return props.row.__items[0].isGroup;
        }

        return false;
    })

    function getOffset() {
        return `padding-left: ${(props.row.level - 1) * 18}px`;
    }

    function toggleDetail() {  
        const event = new CustomEvent('togglegroup', { 
            detail: {
                group: props.row
            }
        });
        dispatchEvent(event);
    }

    function onKey(e: any, down: boolean) {
        const row = e.target as any;
        if (row) {
            let nextRow = down ? row.nextElementSibling : row.previousElementSibling;

            if (nextRow) {
            nextRow.focus();
            }
        }
    }
</script>

<template>
    <tr tabindex="0" class="group" @keyup.down.stop="onKey($event, true)"  @keyup.up.stop="onKey($event, false)">
        <td :colspan="props.columns.length - 4" class="group">
            <div class="group-row" :style="getOffset()">
                <GroupRowToggle :showing="row.showDetail" @click="toggleDetail" @keyup.enter.stop.prevent="toggleDetail" />
                <span class="group-label">{{row.column.label}}: </span>
                <component v-if="row.visualizer" :is="row.visualizer" :column="row.column" :value="row.value" />
                <number-visualizer v-else-if="row.column.type === 'number'" :value="row.value" :column="row.column" />
                <boolean-visualizer v-else-if="row.column.type === 'boolean'" :value="row.value" :column="row.column" />
                <date-visualizer v-else-if="row.column.type === 'date'" :value="row.value" :column="row.column" />
                <text-visualizer v-else :value="row.value" :column="row.column" />
            </div>
        </td>
        <td colspan="1000"></td>
    </tr>
    <template v-if="row.showDetail">
        <template v-for="r in row.__items" :key="r.id">
            <group-row v-if="isGroups" :columns="props.columns" :row="r" :detail="detail" :spacers="spacers" :selection-mode="selectionMode" :open-groups="props.openGroups" 
                :show-summary="showSummary" :update-key="props.updateKey" />
            <body-row v-else :columns="props.columns" :row="r" :detail="detail" :spacers="spacers" :selection-mode="selectionMode" :update-key="props.updateKey" />
        </template>
        <summary-row v-if="showSummary && !isGroups" :columns="props.columns" :rows="row.__items" :spacers="spacers" :detail="detail" :selection-mode="selectionMode" 
            :update-key="props.updateKey" />
    </template> 
</template>

<style scoped>
    .group-row {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    tr.group {
        height: var(--table-group-height);
        box-sizing: border-box;
        font-weight: 500;
        background-color: var(--table-fixed-color);
    }

    tr:focus {
        outline: 1px dashed blue;
        outline-offset: -2px;
    }

    td {
        border-bottom: 1px solid var(--table-separator-color);
    }

    td.group {
        position: sticky;
        left: 0;
        z-index: 1;
        white-space: nowrap;
        padding: 0;
    }

    .group-label {
        user-select: none;
    }
</style>