<script setup lang="ts">
    import { defineProps } from 'vue';
    import TextVisualizer from '../visualizers/TextVisualizer.vue';
    import NumberVisualizer from '../visualizers/NumberVisualizer.vue';
    import BooleanVisualizer from '../visualizers/BooleanVisualizer.vue';
    import DateVisualizer from '../visualizers/DateVisualizer.vue';

    const props = defineProps(['column', 'value']);
</script>

<template>
    <div class="summary-cell-container">
        <component v-if="column.visualizer" :is="column.visualizer" :column="props.column" :value="props.value" />
        <number-visualizer v-else-if="column.type === 'number'" :column="props.column" :value="props.value" />
        <boolean-visualizer v-else-if="column.type === 'boolean'" :column="props.column" :value="props.value" />
        <date-visualizer v-else-if="column.type === 'date'" :column="props.column" :value="props.value" />
        <text-visualizer v-else :column="props.column" :value="props.value" />
    </div>
</template>

<style scoped>
    .summary-cell-container {
        padding: 0 16px 0 24px;
        white-space: nowrap;
    }
</style>