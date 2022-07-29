<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps(['column', 'row', 'value']);

function getValue() {
    if (props.value !== undefined) {
        return props.value.toFixed(2);
    }

    return props.row ? props.row[props.column?.field].toFixed(2) : '';
}
</script>

<template>
    <div class="container">${{getValue()}}</div>
</template>

<style scoped>
    .container {
        text-align: right;
    }
</style>