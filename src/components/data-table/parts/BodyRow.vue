<script setup lang="ts">
import { defineProps, ref, onMounted } from "vue";
import BodyCell from "./BodyCell.vue";
import DetailRowToggle from "./DetailRowToggle.vue";
import RowSpacer from "./RowSpacer.vue";
import RowSelector from "./RowSelector.vue";

const props = defineProps([
  'columns',
  'row',
  'detail',
  'spacers',
  'selectionMode',
  'renderKey'
]);

const el = ref(null);

function toggleDetail() {
  const event = new CustomEvent('togglerow', { 
    detail: {
      id: props.row.id
    }
  });
  dispatchEvent(event);
}

function toggleSelection(selected: any) {
  const event = new CustomEvent("rowselect", {
    detail: {
      selected: selected,
      id: props.row.id
    },
  });
  dispatchEvent(event);
}

onMounted(() => {
  if (el.value) {
    const fixed = (el.value as HTMLElement).querySelectorAll('.fixed');
    let prev: any = null;
    let offset = 0;

    fixed.forEach((f: any, i: number) => {
      if (prev) {
        const rect = prev.getBoundingClientRect();
        f.style.left = `${rect.right - offset}px`;

        if (i === fixed.length - 1) {
          f.classList.add('separator');
        }
      } else {
        const rect = f.getBoundingClientRect();
        offset = rect.left;
      }

      prev = f;
    });
  }
});
</script>

<template>
  <tr ref="el">
    <th v-if="props.selectionMode !== 'none'" class="fixed separator">
      <RowSelector :selected="props.row.selected" @select="toggleSelection" />
    </th>
    <th v-if="props.detail" class="fixed separator">
      <DetailRowToggle :showing="props.row._showDetail" @click="toggleDetail" />
    </th>
    <td v-for="column in props.columns" :key="column.label" :class="column.freeze ? 'fixed' : ''">
      <body-cell :column="column" :row="row"></body-cell>
    </td>
    <td></td>
  </tr>
  <tr v-if="props.detail && props.row._showDetail" class="detail">
    <td colspan="10000" class="detail">
      <component :is="props.detail" :row="props.row" />
    </td>
  </tr>
</template>

<style scoped>
tr {
  height: var(--table-body-height);
  font-weight: 400;
}

tr:last-of-type {
  border-bottom: none;
}

td, th {
    border-bottom: 1px solid var(--table-separator-color);
}

.separator {
  border-right: 1px solid var(--table-separator-color);
}

tr.detail {
  height: auto;
}

td.detail {
  padding: 0;
}

.fixed {
  position: sticky;
  background-color: var(--table-fixed-color);
  top: 0;
  left: 0;
}
</style>