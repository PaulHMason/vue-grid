<script setup lang="ts">
    import { defineProps } from 'vue';

    const props = defineProps(['column', 'row']);

    function getValue() {
        return props.row[props.column.field];
    }
</script>

<template>
    <div>~{{getValue()}}</div>
</template>

<style scoped>

</style>