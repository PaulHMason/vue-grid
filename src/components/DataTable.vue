<script setup lang="ts">
import { defineProps, computed } from "vue";
import { DataGrouper } from "./DataTableTypes.js";
import HeaderRow from "./lib/HeaderRow.vue";
import BodyRow from "./lib/BodyRow.vue";

const props = defineProps([
  "columns",
  "rows",
  "rowDetail",
  "groupBy",
  "filters",
]);

/*
function groupData(groups: Array<string>, data: any) {
  console.log(groups);
  if (groups && groups.length > 0) {
    const column = props.columns.find((c: any) => c.id === groups[0]);

    if (column) {
      const id = column.id;
      const label = column.label;
      const field = column.field;

      data.forEach((item: any) => {
        // If it has items, group them and replace the array.
        const newItems: Array<any> = [];

        if (item.items && item.items.length > 0) {
          const unique = [...new Set(item.items.map((i: any) => i[field]))];

          unique.forEach((i: any) => {
            newItems.push({
              root: false,
              label: `${label}: ${i}`,
              items: item.items.filter((f: any) => f[field] === i),
            });
          });
        }

        if (groups.shift()) {
          newItems.forEach((i: any) => {
            () => groupData([...groups], i);
          });
        }

        item.items = newItems;
      });
    }
  }
}
*/

const data = computed(() => {
  if (props.groupBy) {
    const groups = props.groupBy.split(",").map((s: string) => s.trim());

    if (groups.length > 0) {
      let groupedData = [
        {
          level: 0,
          items: [...props.rows],
        },
      ];

      var grouper = new DataGrouper();
      grouper.groupData(groups, groupedData, props.columns, 1);
      console.log(groupedData);
    }
  }

  return props.rows;
});
</script>

<template>
  <table>
    <thead>
      <header-row :columns="props.columns" :detail="rowDetail" />
    </thead>
    <tbody>
      <body-row
        v-for="row in data"
        :key="row.id"
        :columns="props.columns"
        :row="row"
        :detail="rowDetail"
      />
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