<script setup lang="ts">
    import { defineProps } from 'vue';

    const props = defineProps(['orientation']);
</script>

<template>
    <div class="scrollbar-container" :orientation="orientation">
    </div>
</template>

<style scoped>
    .scrollbar-container {
        background-color: lightgreen;
        outline: 1px dashed blue;
        outline-offset: -1px;
    }

    .scrollbar-container[orientation="vertical"] {
        width: 17px;
        height: 100%;
    }

    .scrollbar-container[orientation="horizontal"] {
        width: 100%;
        height: 17px;
    }
</style>
