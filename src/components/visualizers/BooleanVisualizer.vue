<script setup lang="ts">
    import { defineProps } from 'vue';
    import SvgIcon from '../visualizers/SvgIcon.vue';

    const props = defineProps(['value']);
</script>

<template>
    <div class="container">
        <svg-icon v-if="props.value === true" icon="check" class="true"/>
        <svg-icon v-else icon="cross" class="false"/>
    </div>
</template>

<style scoped>
    .container {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .true {
        fill: green;
    }

    .false {
        fill: red;
    }
</style>