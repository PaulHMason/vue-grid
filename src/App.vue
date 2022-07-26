<script setup lang="ts">
  import DataTable from './components/DataTable.vue';
  import RowDetail from './data/RowDetail.vue';
  import { columns, rows, groupOrder } from './data/TableData';
</script>

<template>
  <data-table :columns="columns" :rows="rows" :row-detail="RowDetail" :group-order="groupOrder" open-group="available" selection-mode="multiple" class="table"></data-table>
</template>

<style scoped>
  .table {
    width: 100%;
    height: 100%;
  }
</style>
