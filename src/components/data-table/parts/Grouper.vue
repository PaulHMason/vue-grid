<script setup lang="ts">
    import { defineProps } from 'vue';
    import type GrouperItemVue from './GrouperItem.vue';
    import GrouperItem from './GrouperItem.vue';
    const props = defineProps(['groups', 'sortBy', 'sortDesc']);

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

    function dragEnter(e: any) {
        e.preventDefault();
        e.target.classList.add('over');
    }

    function dragLeave(e: any) {
        e.preventDefault();
        e.target.classList.remove('over');
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
            <grouper-item :group="group" :sort-by="props.sortBy" :sort-desc="props.sortDesc"/>
            <div class="drop-target" :index="index+1" @dragover="dragOver" @drop="drop" @dragenter="dragEnter" @dragleave="dragLeave">
                <div class="indicator">
                    <div class="info">Drag columns here to group them.</div>
                </div>
            </div>
        </template>
    </div>
</template>

<style scoped>
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
</style>