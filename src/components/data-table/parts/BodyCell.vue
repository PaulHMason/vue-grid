<script setup lang="ts">
    import { defineProps, computed } from 'vue';
    import TextVisualizer from '../visualizers/TextVisualizer.vue';
    import NumberVisualizer from '../visualizers/NumberVisualizer.vue';
    import BooleanVisualizer from '../visualizers/BooleanVisualizer.vue';
    import ArrayVisualizer from '../visualizers/ArrayVisualizer.vue';
    import ActionVisualizer from '../visualizers/ActionVisualizer.vue';
    import DateVisualizer from '../visualizers/DateVisualizer.vue';

    const props = defineProps(['column', 'row', 'value']);

    const val = computed(() => {
         return props.value !== undefined ? props.value : props.row[props.column.field];
    });
</script>

<template>
    <div class="body-cell-container">
        <component v-if="column.visualizer" :is="column.visualizer" :column="props.column" :row="props.row" :value="val" />
        <number-visualizer v-else-if="column.type === 'number'" :column="props.column" :value="val" />
        <boolean-visualizer v-else-if="column.type === 'boolean'" :column="props.column" :value="val" />
        <date-visualizer v-else-if="column.type === 'date'" :column="props.column" :value="val" />
        <array-visualizer v-else-if="column.type === 'list'" :column="props.column" :value="val" />
        <action-visualizer v-else-if="column.type === 'action'" :value="props.column.actionLabel" :action="props.column.actionFunction" :row-id="props.row.id" />
        <text-visualizer v-else :column="props.column" :value="val" />
    </div>
</template>

<style scoped>
    .body-cell-container {
        padding: 0 16px 0 24px;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
</style>