<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue';
import SvgIcon from '../../svg-icon/SvgIcon.vue';

const props = defineProps(['column', 'sortBy', 'sortDesc']);
const emit = defineEmits(['sort']);

function click() {
    if (props.column.sortable) {
        emit('sort', props.column.id);
    }
}

function dragStart(e: any) {
    e.dataTransfer.dropEffect = 'move';
    e.dataTransfer.setData('text/plain', props.column.id);
}

function getSortClasses() {
    const classes = ['icon'];

    if (props.sortDesc) {
        classes.push('icon-desc');
    }

    if (props.column.id === props.sortBy) {
        classes.push('icon-fixed');
    }

    console.log(classes.join(' '));

    return classes.join(' ');
}
</script>

<template>
    <div @click="click" :class="column.sortable ? 'header-cell-container sortable' : 'header-cell-container'" :draggable="column.groupable && !column.grouped" @dragstart="dragStart">
        <svg-icon v-if="column.sortable" icon="arrow-up" class="icon" />
        <span>{{ props.column.label }}</span>
    </div>
</template>

<style scoped>
svg {
    fill: rgba(0, 0, 0, 0.38);
}

.header-cell-container {
    display: flex;
    align-items: center;
    padding: 0 16px 0 24px;
    font-weight: 500;
    white-space: nowrap;
    background-color: var(--table-fixed-color);
}

.icon {
    width: 14px;
    height: 14px;
    margin: 0 3px 2px -19px;
    opacity: 0;
}

.icon-desc {
    transform: rotate(180deg);
}

.icon-fixed {
    fill: rgba(0, 0, 0, 0.87);
    opacity: 1;
}

.sortable {
    cursor: pointer;
}

.header-cell-container:hover .icon {
    opacity: 1;
}
</style>