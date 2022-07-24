<script setup lang="ts">
import { defineProps, computed, ref } from "vue";
import { DataGrouper } from "./DataTableTypes.js";
import HeaderRow from "./lib/HeaderRow.vue";
import BodyRow from "./lib/BodyRow.vue";
import GroupRow from "./lib/GroupRow.vue";

const props = defineProps([
  "columns",
  "rows",
  "rowDetail",
  "groupBy",
  "filters",
]);

const spacers = ref(0);

const data = computed(() => {
  let groupedData = [
      {
        level: 0,
        __items: [...props.rows],
      },
    ];

  if (props.groupBy) {
    const groups = props.groupBy.split(",").map((s: string) => s.trim());

    if (groups.length > 0) {
      var grouper = new DataGrouper();
      grouper.groupData(groups, groupedData, props.columns, 1);
      spacers.value = grouper.maxLevel;
    }
  }

  return groupedData[0].__items;
});
</script>

<template>
  <table>
    <thead>
      <header-row :columns="props.columns" :detail="rowDetail" :spacers="spacers" />
    </thead>
    <tbody>
      <template v-for="row in data" :key="row.id">
        <group-row v-if="row.__items" :columns="props.columns" :row="row" :detail="rowDetail" :spacers="spacers" />
        <body-row v-else :columns="props.columns" :row="row" :detail="rowDetail" :spacers="spacers" />
      </template>
    </tbody>
  </table>
</template>

<style scoped>
table {
  display: block;
  position: relative;
  background-color: white;
  border-radius: 4px;
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