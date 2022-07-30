<script setup lang="ts">
    import { defineProps } from 'vue';
    import TextVisualizer from '../visualizers/TextVisualizer.vue';
    import NumberVisualizer from '../visualizers/NumberVisualizer.vue';
    import BooleanVisualizer from '../visualizers/BooleanVisualizer.vue';
    import ActionVisualizer from '../visualizers/ActionVisualizer.vue';
    import DateVisualizer from '../visualizers/DateVisualizer.vue';

    const props = defineProps(['column', 'row']);
    
    function getValue() {
        return props.row[props.column.field];
    }
</script>

<template>
    <div class="body-cell-container">
        <component v-if="column.visualizer" :is="column.visualizer" :column="props.column" :row="props.row" />
        <number-visualizer v-else-if="column.type === 'number'" :column="props.column" :value="getValue()" />
        <boolean-visualizer v-else-if="column.type === 'boolean'" :column="props.column" :value="getValue()" />
        <date-visualizer v-else-if="column.type === 'date'" :column="props.column" :value="getValue()" />
        <action-visualizer v-else-if="column.type === 'action'" :value="props.column.actionLabel" :action="props.column.actionFunction" :row-id="props.row.id" />
        <text-visualizer v-else :column="props.column" :value="getValue()" />
    </div>
</template>

<style scoped>
    .body-cell-container {
        padding: 0 16px 0 24px;
        white-space: nowrap;
    }
</style>