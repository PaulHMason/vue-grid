<script setup lang="ts">
    import { defineProps, computed } from 'vue';
    import SvgIcon from '../../svg-icon/SvgIcon.vue';

    const props = defineProps(['value', 'column']);

    const displayValue = computed(() => {
        if (props.column && props.column.formatFunction) {
            return props.column.formatFunction(props.value);
        }

        return props.value;
    });
</script>

<template>
    <div class="container">
        <svg-icon v-if="displayValue === true" icon="check" class="true"/>
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