<script setup lang="ts">
import { defineProps, ref, onMounted, onUnmounted, computed } from "vue";

import { type Column, type Group } from "./DataTableTypes.js";
import { DataTableState } from './DataTableState.js';
import HeaderRow from "./lib/HeaderRow.vue";
import BodyRow from "./lib/BodyRow.vue";
import GroupRow from "./lib/GroupRow.vue";
import Grouper from './lib/Grouper.vue';

const props = defineProps([
  'columns',
  'rows',
  'rowDetail',
  'groupOrder',
  'openGroup',
  'filters',
  'selectionMode',
  'sortBy',
  'sortDirection'
]);

const renderKey = ref(0);

function stateUpdated(reason?: string) {
  if (renderKey.value > 1000000) {
    renderKey.value = 0;
  } else {
    renderKey.value += 1;
  }
}

const state: DataTableState = computed(() => {
  return new DataTableState(props.columns, props.rows, props.groupOrder, props.openGroup, props.selectionMode, stateUpdated);
});

function handleSort(columnId: string) {
  state.value.sort(columnId);
}

function onRowSelectAll(e: any) {
  e.preventDefault();
  e.stopPropagation();
  state.value.toggleAllRows(e.detail.selected);
}

function onRowSelect(e: any) {
  e.preventDefault();
  e.stopPropagation();
  state.value.toggleSingleRow(e.detail.selected, e.detail.id);
}

function onAddGroup(e: any) {
  e.preventDefault();
  e.stopPropagation();
  state.value.addGroup(e.detail.id, e.detail.index);
}

function onRemoveGroup(e: any) {
  e.preventDefault();
  e.stopPropagation();
  state.value.removeGroup(e.detail.id);
}

onMounted(() => {
  addEventListener('rowselect', onRowSelect);
  addEventListener('rowselectall', onRowSelectAll);
  addEventListener('addgroup', onAddGroup);
  addEventListener('removegroup', onRemoveGroup);
});

onUnmounted(() => {
  removeEventListener('rowselect', onRowSelect);
  removeEventListener('rowselectall', onRowSelectAll);
  removeEventListener('addgroup', onAddGroup);
  removeEventListener('removegroup', onRemoveGroup);
});
</script>

<template>
  <div class="table-container">
    <Grouper v-if="state.supportGrouping" :groups="state.groupBy" @sort="handleSort" />
    <table>
      <thead>
        <header-row :columns="state.columns" :detail="rowDetail" :spacers="state.maxLevel" :selection-mode="state.selectionMode"
          :selection-state="state.selectionState" @sort="handleSort" :key="renderKey" />
      </thead>
      <tbody>
        <template v-for="row in state.groups" :key="row.id">
          <group-row v-if="row.__items" :columns="state.columns" :row="row" :detail="rowDetail" :spacers="state.maxLevel"
            :selection-mode="state.selectionMode" :open-groups="state.openGroups" :render-key="renderKey"/>
          <body-row v-else :columns="state.columns" :row="row" :detail="rowDetail" :spacers="state.maxLevel"
            :selection-mode="state.selectionMode" :key="renderKey" />
        </template>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-container {
  /*
  --table-font-size: 14px;
  --table-header-height: 56px;
  --table-group-height: 52px;
  --table-body-height: 52px;
  */
  --table-font-size: 14px;
  --table-header-height: 36px;
  --table-group-height: 32px;
  --table-body-height: 32px;
  --table-spacer-size: 32px;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  border-radius: 5px;
  overflow: hidden;
  font-size: var(--table-font-size);
}

table {
  flex: 1;
  display: block;
  position: relative;
  background-color: white;
  border-collapse: collapse;
  overflow: auto;
}

thead {
  position: sticky;
  left: 0;
  top: 0;
  background-color: white;
}
</style>