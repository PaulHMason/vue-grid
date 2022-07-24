<script setup lang="ts">
    import { defineProps } from 'vue';

    const props = defineProps(['value']);
</script>

<template>
    <div>{{props.value}}</div>
</template>

<style scoped>

</style>