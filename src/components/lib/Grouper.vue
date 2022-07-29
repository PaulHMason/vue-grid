<script setup lang="ts">
    import { defineProps, defineEmits } from 'vue';
    import SvgIcon from '../visualizers/SvgIcon.vue';
    const props = defineProps(['groups', 'sortBy', 'sortDesc', 'renderKey']);
    const emit = defineEmits(['sort']);

    function remove(id: string) {
        const event = new CustomEvent('removegroup', { 
            detail: {
                id: id
            }
        });
        dispatchEvent(event);
    }

    function sort(id: string) {
        emit('sort', id);
    }

    function dragOver(e: any) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    function drop(e: any) {
        e.preventDefault();
        e.target.classList.remove('over');

        const event = new CustomEvent('addgroup', { 
            detail: {
                id: e.dataTransfer.getData('text/plain'),
                index: Number.parseInt(e.target.getAttribute('index'))
            }
        });
        dispatchEvent(event);
    }

    function dragStart(e: any) {
        e.dataTransfer.dropEffect = 'move';
        e.dataTransfer.setData('text/plain', e.target.getAttribute('column-id'));
    }

    function dragEnter(e: any) {
        e.preventDefault();
        e.target.classList.add('over');
    }

    function dragLeave(e: any) {
        e.preventDefault();
        e.target.classList.remove('over');
    }

    function getSortClasses(column: any) {
        const classes = ['icon'];

        if (props.sortDesc) {
            classes.push('icon-desc');
        }

        if (column.id === props.sortBy) {
            classes.push('icon-fixed');
        }

        return classes.join(' ');
    }
</script>

<template>
    <div class="grouper-container">
        <div class="drop-target" index="0" @dragover="dragOver" @drop="drop" @dragenter="dragEnter" @dragleave="dragLeave">
            <div class="indicator">
                <div class="info">Drag columns here to group them.</div>
            </div>
        </div>

        <template v-for="(group, index) in props.groups" :key="group.columnId">
            <div :column-id="group.columnId" :class="group.column.sortable ? 'group-item' : 'group-item no-sort'" @click="group.column.sortable ? sort(group.columnId) : null" draggable="true" @dragstart="dragStart">
                <svg-icon v-if="group.column.sortable" icon="arrow-up" :class="getSortClasses(group.column)"/>
                <span :class="group.column.sortable ? '' : 'no-sort'">{{group.label}}</span>
                <svg-icon icon="cross" class="icon icon-fixed" @click.stop="remove(group.columnId)" />
            </div>
            <div class="drop-target" :index="index+1" @dragover="dragOver" @drop="drop" @dragenter="dragEnter" @dragleave="dragLeave">
                <div class="indicator">
                    <div class="info">Drag columns here to group them.</div>
                </div>
            </div>
        </template>
        <!--
        <div class="info">Drag columns here to group them.</div>
        -->
    </div>
</template>

<style scoped>
    svg {
        fill: rgba(0, 0, 0, 0.38);
    }

    .grouper-container {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        box-sizing: border-box;
        gap: 0;
        height: 64px;
        padding: 0;
        color: rgba(0, 0, 0, 0.87);
        background-color: var(--table-group-bar-color);
        border-bottom: 1px solid var(--table-separator-color);
        user-select: none;
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
        cursor: pointer;
    }

    .group-item.no-sort {
        cursor: default;
    }

    .indicator {
        width: 2px;
        pointer-events: none;
    }

    .drop-target {
        display: flex;
        height: 100%;
        box-sizing: border-box;
        padding: 12px 7px;
        width: 16px;
    }

    .info {
        display: none;
        height: 100%;
        align-items: center;
        white-space: nowrap;
        pointer-events: none;
        color: rgba(0, 0, 0, 0.5);
        margin-left: 8px;
    }

    .drop-target.over > .indicator {
        background-color: rgba(0, 0, 0, 0.5);
    }

    .drop-target:last-of-type {
        flex: 1;
    }

    .drop-target:last-of-type .info {
        display: flex;
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