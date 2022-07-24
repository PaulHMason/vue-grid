<script setup lang="ts">
  import DataTable from './components/DataTable.vue';
  import RowDetail from './data/RowDetail.vue';
  import { columns, rows } from './data/TableData';
</script>

<template>
  <data-table :columns="columns" :rows="rows" group-by="available, rating" :row-detail="RowDetail" class="table"></data-table>
</template>

<style scoped>
  .table {
    width: 1300px;
  }
</style>
