<script setup lang="ts">
import { defineProps, ref, onMounted, onUnmounted, shallowRef, computed } from "vue";
import { DataGrouper, type Column, type Group } from "./DataTableTypes.js";
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

const supportGrouping = computed(() => {
  return props.columns.find((column: Column) => column.groupable) ? true : false;
});

const groupBy: any = computed(() => {
  const groupableColumns = props.columns.filter((column: Column) => column.groupable && column.grouped);

  const result: Array<Group> = groupableColumns.map((column: Column) => {
    return {
      columnId: column.id,
      label: column.label,
      sortable: column.groupSortable,
      sort: column.groupSort,
      visualizer: column.groupVisualizer
    }
  });

  if (props.groupOrder && props.groupOrder.length > 0) {
    return result.sort((a, b) => props.groupOrder.indexOf(a.columnId) - props.groupOrder.indexOf(b.columnId));
  } else {
    return result;
  }
});

const openGroups = computed(() => {
  if (!props.openGroup) return [];

  const allGroups = groupBy.value.map((group: any) => group.columnId);
  const i = allGroups.indexOf(props.openGroup);
  return i > -1 ? allGroups.slice(0, i + 1) : [];
});

function group(rows: any) {
  let groupedData = [
    {
      level: 0,
      __items: [...rows],
    },
  ];

  if (groupBy) {
    if (groupBy.value.length > 0) {
      grouper.groupData([...groupBy.value], groupedData, props.columns, 1);
      spacers.value = grouper.maxLevel;
    }
  }

  return groupedData[0].__items;
}

const spacers = ref(0);
const selectionState = ref('none');
const grouper = new DataGrouper();
const data = shallowRef(group(props.rows));

function handleSort(column: Column, direction: any) {
  grouper.maxLevel = 0;
  grouper.sortData(props.rows, column, direction);
  data.value = group(props.rows);
}

function onRowSelectAll(e: any) {
  e.preventDefault();
  e.stopPropagation();
  setSelectionState();
}

function onRowSelect(e: any) {
  e.preventDefault();
  e.stopPropagation();
  setSelectionState();
}

function setSelectionState() {
  const rowCount = props.rows.length;
  const selectedRowCount = props.rows.filter((row: any) => row.selected).length;

  if (selectedRowCount === 0) {
    selectionState.value = 'none';
  } else if (selectedRowCount === rowCount) {
    selectionState.value = 'all';
  } else {
    selectionState.value = 'some';
  }
}

onMounted(() => {
  addEventListener('rowselect', onRowSelect);
  addEventListener('rowselectall', onRowSelectAll);
  setSelectionState();
});

onUnmounted(() => {
  removeEventListener('rowselect', onRowSelect);
  removeEventListener('rowselectall', onRowSelectAll);
});
</script>

<template>
  <div class="table-container">
    <Grouper v-if="supportGrouping" :groups="groupBy" />
    <table>
      <thead>
        <header-row :columns="props.columns" :detail="rowDetail" :spacers="spacers" :selection-mode="selectionMode"
          :selection-state="selectionState" @sort="handleSort" />
      </thead>
      <tbody>
        <template v-for="row in data" :key="row.id">
          <group-row v-if="row.__items" :columns="props.columns" :row="row" :detail="rowDetail" :spacers="spacers"
            :selection-mode="selectionMode" :open-groups="openGroups" />
          <body-row v-else :columns="props.columns" :row="row" :detail="rowDetail" :spacers="spacers"
            :selection-mode="selectionMode" />
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