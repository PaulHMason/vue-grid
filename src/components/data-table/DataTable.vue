<script setup lang="ts">
import { defineProps, ref, onMounted, onUnmounted, shallowReactive } from "vue";

//import { type Column, type Group } from "./DataTableTypes.js";
import { DataTableState } from './DataTableState.js';
import HeaderRow from "./parts/HeaderRow.vue";
import BodyRow from "./parts/BodyRow.vue";
import GroupRow from "./parts/GroupRow.vue";
import Grouper from './parts/Grouper.vue';
import SummaryRow from "./parts/SummaryRow.vue";
import FilterRow from "./parts/FilterRow.vue";
import type { Column } from "./DataTableTypes.js";

const props = defineProps({
    columns: Array<Column>,
    rows: Array<object>,
    rowDetail: Object,
    groupOrder: Array<string>,
    openGroup: String,
    filters: Object,
    selectionMode: String,
    sortBy: String,
    sortDirection: String,
    groupSummary: Boolean,
    hideFilter: Boolean,
    filterAll: Boolean
});

const updateKey = ref(0);

function stateUpdated(reason?: string) {
  if (updateKey.value > 1000000) {
    updateKey.value = 0;
  } else {
    updateKey.value += 1;
  }
}

const state = shallowReactive(new DataTableState(props.columns, props.rows, props.groupOrder, props.openGroup, 
  (props.selectionMode as any), stateUpdated, props.filterAll, props.hideFilter));

function handleSort(columnId: string) {
  state.sort(columnId);
}

function onRowSelectAll(e: any) {
  e.preventDefault();
  e.stopPropagation();
  state.selectAllRows(e.detail.selected);
}

function onRowSelect(e: any) {
  e.preventDefault();
  e.stopPropagation();
  state.selectSingleRow(e.detail.selected, e.detail.id);
}

function onAddGroup(e: any) {
  e.preventDefault();
  e.stopPropagation();
  state.addGroup(e.detail.id, e.detail.index);
}

function onRemoveGroup(e: any) {
  e.preventDefault();
  e.stopPropagation();
  state.removeGroup(e.detail.id);
}

function onRowToggle(e: any) {
  e.preventDefault();
  e.stopPropagation();
  state.toggleRowDetail(e.detail.id);
}

function onGroupToggle(e: any) {
  e.preventDefault();
  e.stopPropagation();
  state.toggleGroupDetail(e.detail.group);
}

function onFilter(e: any) {
  e.preventDefault();
  e.stopPropagation();
  state.filter(e.detail.columnId, e.detail.value, e.detail.operator);
}

function onLoad(e: any) {
  setTimeout(() => stateUpdated(), 250);
}

onMounted(() => {
  addEventListener('rowselect', onRowSelect);
  addEventListener('rowselectall', onRowSelectAll);
  addEventListener('addgroup', onAddGroup);
  addEventListener('removegroup', onRemoveGroup);
  addEventListener('togglerow', onRowToggle);
  addEventListener('togglegroup', onGroupToggle);
  addEventListener('filter', onFilter);
  addEventListener('load', onLoad, {once : true});
});

onUnmounted(() => {
  removeEventListener('rowselect', onRowSelect);
  removeEventListener('rowselectall', onRowSelectAll);
  removeEventListener('addgroup', onAddGroup);
  removeEventListener('removegroup', onRemoveGroup);
  removeEventListener('togglerow', onRowToggle);
  removeEventListener('filter', onFilter);
  removeEventListener('togglegroup', onGroupToggle);
});
</script>

<template>
  <div class="table-container">
    <Grouper v-if="state.supportGrouping" :groups="state.groupBy" :sort-by="state.sortBy" :sort-desc="state.sortDesc" @sort="handleSort" />
    <table>
      <thead>
        <header-row :columns="state.columns" :detail="rowDetail" :spacers="state.maxLevel" :selection-mode="state.selectionMode"
          :selection-state="state.selectionState" @sort="handleSort" :sort-by="state.sortBy" :sort-desc="state.sortDesc" :update-key="updateKey" />
        <filter-row v-if="state.filterVisible" :columns="state.columns" :filters="state.filters" :detail="rowDetail" :spacers="state.maxLevel" 
          :selection-mode="state.selectionMode" :update-key="updateKey" />
      </thead>
      <tbody>
        
        <template v-for="row in state.groups" :key="row.id">
          <group-row v-if="row.__items" :columns="state.columns" :row="row" :detail="rowDetail" :spacers="state.maxLevel"
            :selection-mode="state.selectionMode" :open-groups="state.openGroups" :show-summary="state.hasSummary && groupSummary" :key="row.id"
            :update-key="updateKey" />
          <body-row v-else :columns="state.columns" :row="row" :detail="rowDetail" :spacers="state.maxLevel"
            :selection-mode="state.selectionMode" :update-key="updateKey" />
        </template>
        <summary-row v-if="state.hasSummary && (!groupSummary || (groupSummary && state.maxLevel === 0))" :columns="state.columns" :rows="state.rows" 
          :spacers="state.maxLevel" :detail="rowDetail" :selection-mode="state.selectionMode" :update-key="updateKey" />
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-container {
  /*
 --table-font-size: 14px;
  --table-header-height: 36px;
  --table-group-height: 32px;
  --table-body-height: 32px;
  --table-spacer-size: 32px;
  --table-fixed-color: #FAFAFA;
  --table-group-bar-color: linen;
  --table-summary-bar-color: lightyellow;
  --table-filter-bar-color: white;
  --table-separator-color: #E0E0E0;
  */
  --table-font-size: 14px;
  --table-header-height: 36px;
  --table-group-height: 32px;
  --table-body-height: 32px;
  --table-spacer-size: 32px;
  --table-fixed-color: #F0F0F0;
  --table-group-bar-color: linen;
  --table-summary-bar-color: lightyellow;
  --table-filter-bar-color: slategray;
  --table-separator-color: #E0E0E0;
  --table-body-selected-color: #FAFAFA;
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
  border-collapse: separate;
  border-spacing: 0;
  overflow: auto;
}
</style>