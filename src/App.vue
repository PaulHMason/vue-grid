<script setup lang="ts">
  import DataTable from './components/data-table/DataTable.vue';
  import RowDetail from './demo/RowDetail.vue';
  import { columns, rows, groupOrder } from './demo/WithdrawalData.js';
</script>

<template>
  <data-table class="table"  :columns="columns" :rows="rows" :group-order="groupOrder" selection-mode="multiple" :row-detail="RowDetail" 
              group-summary filter-allx hide-filterx column-separatorsx reorder-columnsx column-sizing="auto"></data-table>
</template>

<style scoped>
  .table {
    width: 100%;
    height: 100%;
  }
</style>
