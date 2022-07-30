<script setup lang="ts">
  import DataTable from './components/data-table/DataTable.vue';
  import RowDetail from './demo/RowDetail.vue';
  import { columns, rows, groupOrder } from './demo/TableData.js';
</script>

<template>
  <data-table class="table"  :columns="columns" :rows="rows" :row-detail="RowDetail" :group-order="groupOrder" open-group="available" selection-mode="multiple" 
              group-summary filter-all hide-filterx></data-table>
</template>

<style scoped>
  .table {
    width: 100%;
    height: 100%;
  }
</style>
