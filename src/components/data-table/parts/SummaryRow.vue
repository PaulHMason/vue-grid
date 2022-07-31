<script setup lang="ts">
    import RowSpacer from './RowSpacer.vue';
    import { defineProps, onMounted, onUpdated, ref } from 'vue';
    import SummaryCell from './SummaryCell.vue';
    const props = defineProps(['columns', 'rows', 'spacers', 'detail', 'selectionMode', 'updateKey']);
    const el = ref(null);

    function getSummary(column: any) {
        switch (column.summary) {
            case 'sum': {
                let total = 0;
        
                props.rows.forEach((row: any) => {
                    total += row[column.field];
                });

                return Number.isNaN(total) ? '' : total;
            }

            case 'custom': {
                if (column.summaryFunction) {
                    return column.summaryFunction(column, props.rows)
                } else {
                    return '';
                }
            }

            default: {
                return '';
            }
        }
    }

    function updateSpacers() {
        if (el.value) {
            const fixed = (el.value as HTMLElement).querySelectorAll('.fixed');
            let prev: any = null;
            let offset = 0;

            fixed.forEach((f: any) => {
                if (prev) {
                    const rect = prev.getBoundingClientRect();
                    f.style.left = `${rect.right - offset}px`;
                } else {
                    const rect = f.getBoundingClientRect();
                    offset = rect.left;
                }
                f.classList.remove('last-fixed');

                prev = f;
            });

            fixed[fixed.length - 1].classList.add('last-fixed');
        }
    }

    onMounted(() => {
        updateSpacers();
    });

    onUpdated(() => {
        updateSpacers();
    });

    function onKey(e: any, down: boolean) {
        const row = e.target as any;
        if (row) {
            let nextRow = down ? row.nextElementSibling : row.previousElementSibling;

            if (nextRow) {
            nextRow.focus();
            }
        }
    }
</script>

<template>
    <tr tabindex="0" ref="el" @keyup.down.stop="onKey($event, true)"  @keyup.up.stop="onKey($event, false)">
        <th v-if="props.detail" class="fixed"></th>
        <th v-if="props.selectionMode" class="fixed"></th>
        <template v-for="column in props.columns" :key="column.id">
            <td v-if="column.summary" :class="column.freeze ? 'fixed' : ''">
                <summary-cell :column="column" :value="getSummary(column)"/>
            </td>
            <td v-else :class="column.freeze ? 'fixed' : ''"></td>
        </template>
        <td></td>
    </tr>
</template>

<style scoped>
tr {
    height: var(--table-group-height);
    font-weight: 500;
    background-color: var(--table-summary-bar-color);
}

tr:focus {
    outline: 1px dashed blue;
    outline-offset: -1px;
}

td, th {
    border-bottom: 1px solid var(--table-separator-color);
}

.fixed {
    background-color: var(--table-summary-bar-color);
    position: sticky;
    left: 0;
}

.last-fixed {
    border-right: 1px solid var(--table-separator-color);
}
</style>