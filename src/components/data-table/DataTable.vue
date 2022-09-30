<script setup lang="ts">
import { defineProps, ref, onMounted, onUnmounted, onUpdated, shallowReactive, onBeforeUpdate } from "vue";
import { DataTableState } from './DataTableState.js';
import HeaderRow from "./parts/HeaderRow.vue";
import BodyRow from "./parts/BodyRow.vue";
import GroupRow from "./parts/GroupRow.vue";
import Grouper from './parts/Grouper.vue';
import SummaryRow from "./parts/SummaryRow.vue";
import FilterRow from "./parts/FilterRow.vue";
import ScrollOverlay from "../scroll-bar/ScrollOverlay.vue";
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
    filterAll: Boolean,
    reorderColumns: Boolean,
    columnSeparators: {
      type: Boolean,
      default: null
    },
    columnSizing: {
      type: String,
      default: 'auto'
    }
});

let rowHeight = 0;
let timeoutRef = 0;
let frame: any = null;
const updateKey = ref(0);
const container = ref(null);
const table = ref(null);
const body = ref(null);
const leadingRow = ref(null);
const trailingRow = ref(null);
const scrolling = ref(false);
const scrollingFast = ref(false);

/*
const frame = ref({
  leading: 0,
  trailing: 0,
  content: 0,
  delta: 0,
  startItemIndex: 0,
  itemCount: 0
});
*/


function stateUpdated(reason?: string) {
  if (updateKey.value > 1000000) {
    updateKey.value = 0;
  } else {
    updateKey.value += 1;
  }
}

const state = shallowReactive(new DataTableState());

function throttle(callback: any, limit: number) {
    let wait = false;

    return function (...args: any) {
        if (!wait) {
            callback(...args);
            wait = true;

            setTimeout(function () {
                wait = false;
            }, limit);
        }
    };
}

function onSort(e: any) {
  state.sort(e.detail.id);
  //setFrame(state.refreshFrameGroups());
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
  (table.value as any).scrollTop = 0;
  //setFrame(state.refreshFrameGroups());
}

function onRemoveGroup(e: any) {
  e.preventDefault();
  e.stopPropagation();
  state.removeGroup(e.detail.id);
  (table.value as any).scrollTop = 0;
  //setFrame(state.refreshFrameGroups());
}

function onShiftGroup(e: any) {
  e.preventDefault();
  e.stopPropagation();
  state.shiftGroup(e.detail.id, e.detail.direction);
  (table.value as any).scrollTop = 0;
  //setFrame(state.refreshFrameGroups());
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
  //(table.value as any).scrollTop = 0;
  //setFrame(state.refreshFrameGroups());
}

function onFilter(e: any) {
  e.preventDefault();
  e.stopPropagation();
  state.filter(e.detail.columnId, e.detail.value, e.detail.operator);
  //(table.value as any).scrollTop = 0;
  //setFrame(state.refreshFrameGroups());
}

function onMoveColumn(e: any) {
  e.preventDefault();
  e.stopPropagation();

  if (e.detail.src !== e.detail.dest) {
    state.moveColumn(e.detail.src, e.detail.dest);
  }
}

function onColumnResized() {
  stateUpdated();
}

function onTableScroll(e: any) {
  scrolling.value = true;
  clearTimeout(timeoutRef);
  setDisplayFrame();

  timeoutRef = setTimeout(() => {
    scrolling.value = false;
    //setDisplayFrame();
    //state.setDisplayFrame(frame);
  }, 250);
}

const onTableScrollThrottled = throttle(onTableScroll, 1);

function setDisplayFrame() {
  if (table.value) {
    const tb: any = table.value;
    frame = {
      itemHeight: rowHeight,
      scrollTop: tb.scrollTop,
      clientHeight: tb.clientHeight,
      scrollHeight: tb.scrollHeight
    }
  }

  state.setDisplayFrame(frame);
}

function onLoad(e: any) {
  setTimeout(() => stateUpdated(), 250);
}

onBeforeUpdate(() => {
  setDisplayFrame();
});

onMounted(() => {
  rowHeight =  Number(getComputedStyle(container.value as any).getPropertyValue('--table-row-height').replace('px', ''));

  state.initialize(props.columns, props.rows, props.groupOrder, props.openGroup, 
  (props.selectionMode as any), stateUpdated, props.filterAll, props.hideFilter);
  
  addEventListener('rowselect', onRowSelect);
  addEventListener('rowselectall', onRowSelectAll);
  addEventListener('addgroup', onAddGroup);
  addEventListener('removegroup', onRemoveGroup);
  addEventListener('shiftgroup', onShiftGroup);
  addEventListener('togglerow', onRowToggle);
  addEventListener('togglegroup', onGroupToggle);
  addEventListener('movecolumn', onMoveColumn);
  addEventListener('columnresized', onColumnResized);
  addEventListener('filter', onFilter);
  addEventListener('sort', onSort);
  addEventListener('load', onLoad, {once : true});
});

onUnmounted(() => {
  removeEventListener('rowselect', onRowSelect);
  removeEventListener('rowselectall', onRowSelectAll);
  removeEventListener('addgroup', onAddGroup);
  removeEventListener('removegroup', onRemoveGroup);
  removeEventListener('shiftgroup', onShiftGroup);
  removeEventListener('togglerow', onRowToggle);
  removeEventListener('filter', onFilter);
  removeEventListener('togglegroup', onGroupToggle);
  removeEventListener('movecolumn', onMoveColumn);
  removeEventListener('columnresized', onColumnResized);
  removeEventListener('sort', onSort);
});

</script>

<template>
  <div ref="container" class="table-container">
    <Grouper v-if="state.supportGrouping" :groups="state.groupBy" :sort-by="state.sortBy" :sort-desc="state.sortDesc" />
    <table ref="table" :column-separators="props.columnSeparators" @scroll="onTableScrollThrottled">
      <thead>
        <header-row :columns="state.columns" :detail="rowDetail" :spacers="state.maxLevel" :selection-mode="state.selectionMode"
          :selection-state="state.selectionState" :sort-by="state.sortBy" :sort-desc="state.sortDesc" :reorder-columns="props.reorderColumns" 
          :column-sizing="props.columnSizing" :update-key="updateKey" />
        <filter-row v-if="state.filterVisible" :columns="state.columns" :filters="state.filters" :detail="rowDetail" :spacers="state.maxLevel" 
          :selection-mode="state.selectionMode" :update-key="updateKey" />
      </thead>
      <tbody>
        <tr ref="leadingRow" class="virtual-row" :style="`height: ${state.displayItemData.leading}px;`"></tr>
      </tbody>
      <tbody ref="body">
        <template v-for="row in state.visibleGroups" :key="row.id">
          <group-row v-if="row.isGroup && row.__items" :columns="state.columns" :row="row" :detail="rowDetail" :spacers="state.maxLevel"
            :selection-mode="state.selectionMode" :open-groups="state.openGroups" :show-summary="state.hasSummary && groupSummary" :key="row.id"
            :update-key="updateKey" />
          <body-row v-else :columns="state.columns" :row="row" :detail="rowDetail" :spacers="state.maxLevel"
            :selection-mode="state.selectionMode" :update-key="updateKey" />
        </template> 
      </tbody>
      <tbody>
        <tr ref="trailingRow" class="virtual-row" :style="`height: ${state.displayItemData.trailing}px;`"></tr>
        <summary-row v-if="state.hasSummary && (!groupSummary || (groupSummary && state.maxLevel === 0))" :columns="state.columns" :rows="state.rows" 
          :spacers="state.maxLevel" :detail="rowDetail" :selection-mode="state.selectionMode" :update-key="updateKey" />
      </tbody>
    </table>
    <!--
    <ScrollOverlay :for="table" :track="body" />
    -->
  </div>
</template>

<style scoped>
.table-container {
  --table-font-size: 14px;
  --table-spacer-size: 32px;

  --table-header-height: 36px;
  --table-filter-height: 32px;
  --table-row-height: 32px;

  --table-focus-color: #0075FF;
  --table-fixed-color: #F0F0F0;
  --table-group-bar-color: linen;
  --table-summary-bar-color: lightyellow;
  --table-filter-bar-color: #F0F0F0;
  --table-separator-color: #E0E0E0;
  --table-resizer-color: #C0C0C0;
  --table-body-selected-color: #FAFAFA;
  
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
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
  scrollbar-width: thin;
  scrollbar-color: silver var(--table-fixed-color);
}

*::-webkit-scrollbar { 
  width: 8px;
  height: 8px;
  background: var(--table-fixed-color);
}

*::-webkit-scrollbar-corner {
  background: var(--table-fixed-color);
}

/*
tbody[scrolling="true"] {
  opacity: 0;
}
*/

/*
table:hover::-webkit-scrollbar { 
  width: 8px;
  height: 8px;
}

table:hover {
  scrollbar-width: thin;
}
*/

table::-webkit-scrollbar-track {
  background: var(--table-fixed-color);
}

table::-webkit-scrollbar-thumb {
  background-color: silver;
}

table::-webkit-scrollbar-track:vertical {
  margin-top: var(--table-header-height);
}

tbody {
  position: relative;
}

.virtual-row {
  height: 0;
}

/*
table[column-separators] >>> tr[data-row] > td:not(:last-child), table[column-separators] >>> tr[data-row] > th:not(:last-child) {
  border-right: 1px solid var(--table-separator-color);
}
*/

table[column-separators]:deep(tr[data-row] > td:not(:last-child)), 
table[column-separators]:deep(tr[data-row] > th:not(:last-child)) {
  border-right: 1px solid var(--table-separator-color);
}

/*
:deep()
table >>> tr[body-row] > td, table >>> tr[body-row] > th {
  border-bottom: none;
}
*/

</style>