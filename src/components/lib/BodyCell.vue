<script setup lang="ts">
    import { defineProps } from 'vue';
    import TextVisualizer from '../visualizers/TextVisualizer.vue';
    import NumberVisualizer from '../visualizers/NumberVisualizer.vue';
    import BooleanVisualizer from '../visualizers/BooleanVisualizer.vue';
    import ActionVisualizer from '../visualizers/ActionVisualizer.vue';

    const props = defineProps(['column', 'row']);
    
    function getValue() {
        return props.row[props.column.field];
    }
</script>

<template>
    <td>
        <component v-if="column.visualizer" :is="column.visualizer" :column="props.column" :row="props.row" />
        <number-visualizer v-else-if="column.type === 'number'" :value="getValue()" />
        <boolean-visualizer v-else-if="column.type === 'boolean'" :value="getValue()" />
        <action-visualizer v-else-if="column.type === 'action'" :value="props.column.actionLabel" :action="props.column.actionFunction" :row-id="props.row.idd" />
        <text-visualizer v-else :value="getValue()" />
    </td>
</template>

<style scoped>
    td {
        padding: 1px 16px;
        white-space: nowrap;
    }
</style>