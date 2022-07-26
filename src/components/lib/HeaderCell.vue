<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue';
import SvgIcon from '../visualizers/SvgIcon.vue';

const props = defineProps(['column']);
const emit = defineEmits(['sort']);
const sortAsc = ref(false);

function click() {
    if (props.column.sortable) {
        sortAsc.value = !sortAsc.value;
        emit('sort', props.column, sortAsc.value ? 'asc' : 'desc');
    }
}
</script>

<template>
    <th @click="click" :class="column.sortable ? 'sortable' : ''">
        <div class="container">
            <svg-icon v-if="column.sortable" icon="arrow-up" :class="sortAsc ? 'icon' : 'icon icon-desc'" />
            <span>{{ props.column.label }}</span>
        </div>
    </th>
</template>

<style scoped>
.container {
    display: flex;
    align-items: center;
}

.icon {
    width: 14px;
    height: 14px;
    margin: 0 3px 2px -19px;
    opacity: 0;
    transition: transform 0.1s linear;
}

.icon-desc {
    transform: rotate(180deg);
}

svg {
    fill: rgba(0, 0, 0, 0.38);
}

th {
    padding: 1px 16px 1px 24px;
    font-weight: 500;
    white-space: nowrap;
    background-color: #FAFAFA;
}

th.sortable {
    cursor: pointer;
}

th:hover .icon {
    opacity: 1;
}
</style>