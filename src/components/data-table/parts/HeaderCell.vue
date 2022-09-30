<script setup lang="ts">
import { defineProps, computed } from 'vue';
import { unsortableTypes } from '../DataTableTypes.js';
import SvgIcon from '../../svg-icon/SvgIcon.vue';

const props = defineProps(['column', 'sortBy', 'sortDesc', 'reorderColumns']);

const canSort = computed(() => {
    return props.column.sortable && (!unsortableTypes.includes(props.column.type) || props.column.sortFunction);
});

function click() {
    if (props.column.sortable) {
        const event = new CustomEvent('sort', { 
            detail: {
                id: props.column.id
            }
        });
        dispatchEvent(event);
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

function group(e: any) {
    if (e.ctrlKey && e.altKey && e.code === 'KeyG') {
        console.log(e);
        const event = new CustomEvent('addgroup', { 
            detail: {
                id: props.column.id,
                index: -1
            }
        });
        dispatchEvent(event);
    }
}
</script>

<template>
    <div tabindex="0" @click.stop="click" @keyup.ctrl.alt.stop.prevent="group" :class="(column.groupable || (props.reorderColumns && !column.freeze)) ? 'header-cell-container groupable' : 'header-cell-container'" 
        :draggable="(column.groupable || (props.reorderColumns && !column.freeze))" @dragstart="dragStart">
        <svg-icon @keyup.enter.stop.prevent="click" tabindex="0" v-if="canSort" icon="arrow-up" :class="getSortClasses()" />
        <span>{{ props.column.label }}</span>
    </div>
</template>

<style scoped>
svg {
    fill: rgba(0, 0, 0, 0.38);
}

svg:focus {
    outline: 2px solid var(--table-focus-color);
    outline-offset: -1px;
    border-radius: 3px;
}

.header-cell-container {
    display: flex;
    align-items: center;
    height: var(--table-header-height);
    box-sizing: border-box;
    padding: 0 16px 0 24px;
    font-weight: 500;
    white-space: nowrap;
    text-overflow: ellipsis;
    background-color: var(--table-fixed-color);
}

.header-cell-container:focus {
    outline: 1px dashed var(--table-focus-color);
    outline-offset: -1px;
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

.groupable {
    cursor: grab;
}

.header-cell-container:hover .icon, .icon:focus {
    opacity: 1;
}
</style>