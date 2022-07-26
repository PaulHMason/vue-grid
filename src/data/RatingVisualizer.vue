<script setup lang="ts">
    import { defineProps } from 'vue';
    import SvgIcon from '../components/visualizers/SvgIcon.vue';

    const props = defineProps(['column', 'row', 'value']);

    function getValue() {
        return props.row ? props.row[props.column.field] : props.value;
    }
</script>

<template>
    <div class="container">
        <SvgIcon v-for="i in getValue()" icon="star" class="icon" />
        <SvgIcon v-for="i in (5 - getValue())" icon="star-border" class="icon" />
    </div>
</template>

<style scoped>
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .icon {
        fill: coral;
        width: 18px;
        height: 18px;
    }
</style>