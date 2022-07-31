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

    return classes;
}
</script>

<template>
    <div @click.stop="click" :class="column.sortable ? 'header-cell-container sortable' : 'header-cell-container'" :draggable="column.groupable && !column.grouped" @dragstart="dragStart">
        <svg-icon @keyup.enter.stop.prevent="click" tabindex="0" v-if="column.sortable" icon="arrow-up" :class="getSortClasses()" />
        <span>{{ props.column.label }}</span>
    </div>
</template>

<style scoped>
svg {
    fill: rgba(0, 0, 0, 0.38);
}

svg:focus {
    outline: 1px dashed blue;
    outline-offset: -1px;
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

.header-cell-container:hover .icon, .icon:focus {
    opacity: 1;
}
</style>