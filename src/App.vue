<script setup lang="ts">
  import DataTable from './components/DataTable.vue';
  import RowDetail from './data/RowDetail.vue';
  import { columns, rows } from './data/TableData';
</script>

<template>
  <data-table :columns="columns" :rows="rows" :row-detail="RowDetail" group-by="available,rating" class="table"></data-table>
</template>

<style scoped>
  .table {
    width: 1142px;
    height: 350px;
  }
</style>
