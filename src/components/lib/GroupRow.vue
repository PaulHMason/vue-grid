<script setup lang="ts">
    import { defineProps, ref, onBeforeMount } from 'vue';
    import GroupRowToggle from './GroupRowToggle.vue';
    import BodyRow from './BodyRow.vue';
    import TextVisualizer from '../visualizers/TextVisualizer.vue';
    import NumberVisualizer from '../visualizers/NumberVisualizer.vue';
    import BooleanVisualizer from '../visualizers/BooleanVisualizer.vue';

    const props = defineProps(['columns', 'row', 'detail', 'spacers', 'selectionMode', 'openGroups']);
    const showDetail = ref(false);

    function getOffset() {
        return `padding-left: ${(props.row.level - 1) * 18}px`;
    }

    function toggleDetail() {  
        showDetail.value = !showDetail.value;
    }

    onBeforeMount(() => {
        if (props.openGroups.indexOf(props.row.column.id) > -1) {
            showDetail.value = true;
        }
    });
</script>

<template>
    <tr class="group">
        <td colspan="10000" class="group">
            <div class="group-row" :style="getOffset()">
                <GroupRowToggle :showing="showDetail" @click="toggleDetail" />
                <span class="group-label">{{row.column.label}}: </span>
                <component v-if="row.visualizer" :is="row.visualizer" :column="row.column" :value="row.value" />
                <number-visualizer v-else-if="row.column.type === 'number'" :value="row.value" />
                <boolean-visualizer v-else-if="row.column.type === 'boolean'" :value="row.value" />
                <text-visualizer v-else :value="row.value" />
            </div>
        </td>
    </tr>
    <template v-if="showDetail">
        <template v-for="row in row.__items" :key="row.id">
            <group-row v-if="row.__items" :columns="props.columns" :row="row" :detail="detail" :spacers="spacers" :selection-mode="selectionMode" :open-groups="props.openGroups" />
            <body-row v-else :columns="props.columns" :row="row" :detail="detail" :spacers="spacers" :selection-mode="selectionMode" />
        </template>
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
        font-weight: 500;
        background-color: #FAFAFA;
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    }

    td.group {
        padding: 0;
    }

    .group-label {
        user-select: none;
    }
</style>