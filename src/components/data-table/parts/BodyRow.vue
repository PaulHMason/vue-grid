<script setup lang="ts">
import { defineProps, ref, onMounted, onUpdated } from "vue";
import BodyCell from "./BodyCell.vue";
import DetailRowToggle from "./DetailRowToggle.vue";
import RowSelector from "./RowSelector.vue";

const props = defineProps([
  'columns',
  'row',
  'detail',
  'spacers',
  'selectionMode', 
  'updateKey'
]);

const rowEl = ref(null);
const detailEl = ref(null);

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

function updateSpacers() {
  if (rowEl.value) {
    const fixed = (rowEl.value as HTMLElement).querySelectorAll('.fixed');
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
}

function onKey(e: any, down: boolean) {
  let row = e.target as any;

  if (row !== detailEl.value) {
    row = rowEl.value;
  }

  if (row) {
    let nextRow = down ? row.nextElementSibling : row.previousElementSibling;

    if (nextRow) {
      nextRow.focus();
    }
  }
}

onMounted(() => {
  updateSpacers();
});

onUpdated(() => {
  updateSpacers();
});
</script>

<template>
  <tr data-row body-row ref="rowEl" tabindex="0" @keyup.down.stop="onKey($event, true)"  @keyup.up.stop="onKey($event, false)">
    <th v-if="props.selectionMode !== 'none'" class="fixed">
      <RowSelector class="separator" :selected="props.row.selected" @select="toggleSelection" />
    </th>
    <th v-if="props.detail" class="fixed separator">
      <DetailRowToggle :showing="props.row._showDetail" @click="toggleDetail" @keyup.enter.stop.prevent="toggleDetail" />
    </th>
    <td v-for="column in props.columns.filter((c: any) => !c.hide)" :key="column.id" :class="column.freeze ? 'fixed' : ''">
      <body-cell :column="column" :row="row"></body-cell>
    </td>
    <td></td>
  </tr>
  <tr ref="detailEl" v-if="props.detail && props.row._showDetail" class="detail" is-detail tabindex="0" @keyup.down.stop="onKey($event, true)"  @keyup.up.stop="onKey($event, false)">
    <td colspan="10000" class="detail">
      <component :is="props.detail" :row="props.row" />
    </td>
  </tr>
</template>

<style scoped>
tr {
  height: var(--table-row-height);
  font-weight: 400;
  contain: strict;
}

tr:hover, tr:focus-within {
  background-color: var(--table-body-selected-color);
}

tr:focus-within {
  outline: 1px dashed var(--table-focus-color);
  outline-offset: -1px;
}

tr:last-of-type {
  border-bottom: none;
}

td, th {
    padding: 0;
    box-sizing: border-box;
    border-bottom: 1px solid var(--table-separator-color);
    contain: content;
}

.separator {
  border-right: 1px solid var(--table-separator-color);
  height: var(--table-row-height);
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