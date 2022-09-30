<script setup lang="ts">
    import { defineProps, computed } from 'vue';

    const props = defineProps(['value', 'column']);

    const displayValue = computed(() => {
        if (props.column && props.column.formatFunction) {
            return props.column.formatFunction(props.value);
        }

        return props.value.join(',');
    });
</script>

<template>
    <div>{{displayValue}}</div>
</template>

<style scoped>
    div {
        text-overflow: ellipsis;
    }
</style>