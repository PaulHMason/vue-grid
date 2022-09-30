<script setup lang="ts">
    import { defineProps, computed } from 'vue';
    import SvgIcon from '../../svg-icon/SvgIcon.vue';
    import { unsortableTypes } from '../DataTableTypes.js';
    const props = defineProps(['group', 'sortBy', 'sortDesc']);

    const canSort = computed(() => {
        return props.group.column.sortable && (!unsortableTypes.includes(props.group.column.type) || props.group.column.sortFunction);
    });


    function dragStart(e: any) {
        e.dataTransfer.dropEffect = 'move';
        e.dataTransfer.setData('text/plain', e.target.getAttribute('column-id'));
    }

    function sort(id: string) {
        const event = new CustomEvent('sort', { 
            detail: {
                id: id
            }
        });
        dispatchEvent(event);
    }

    function shift(columnId: string, direction: 'left' | 'right') {
        const event = new CustomEvent('shiftgroup', { 
            detail: {
                id: columnId,
                direction: direction
            }
        });
        dispatchEvent(event);
    }

    function remove(id: string) {
        const event = new CustomEvent('removegroup', { 
            detail: {
                id: id
            }
        });
        dispatchEvent(event);
    }

    function getSortClasses(column: any) {
        const classes = ['icon'];

        if (props.sortDesc) {
            classes.push('icon-desc');
        }

        if (column.id === props.sortBy) {
            classes.push('icon-fixed');
        }

        return classes;
    }
</script>

<template>
    <div tabindex="0" :column-id="group.columnId" class="group-item" 
        @click="canSort ? sort(group.columnId) : null"  @keyup.enter.stop.prevent="canSort ? sort(group.columnId) : null"
        @keyup.ctrl.left.stop.prevent="shift(group.columnId, 'left')" @keyup.ctrl.right.stop.prevent="shift(group.columnId, 'right')"
        draggable="true" @dragstart="dragStart">
        <svg-icon tabindex="0" v-if="canSort" icon="arrow-up" :class="getSortClasses(group.column)"/>
        <span>{{group.label}}</span>
        <svg-icon tabindex="0" icon="cross" class="icon icon-fixed" @click.stop="remove(group.columnId)" @keyup.enter.stop.prevent="remove(group.columnId)" />
    </div>
</template>

<style scoped>
    svg {
        fill: rgba(0, 0, 0, 0.38);
    }

    .group-item {
        height: 32px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        border: 1px solid rgba(0, 0, 0, 0.87);
        padding: 8px 8px;
        border-radius: 3px;
    }

    .group-item:focus {
        outline: 2px solid var(--table-focus-color);
        outline-offset: 1px;
    }

    .icon:focus {
        outline: 2px solid var(--table-focus-color);
        outline-offset: -1px;
        border-radius: 3px;
        opacity: 1;
    }

    .icon {
        width: 14px;
        height: 14px;
        opacity: 0;
        cursor: pointer;
    }

    .icon-desc {
        transform: rotate(180deg);
    }

    .icon-fixed {
        fill: rgba(0, 0, 0, 0.87);
        opacity: 1;
    }

    .group-item:hover .icon {
        opacity: 1;
    }

    span.no-sort {
        margin-left: 8px;
    }
</style>