<script setup lang="ts">
    import { defineProps, ref, onMounted, onUpdated } from 'vue';
    import SvgIcon from '../../svg-icon/SvgIcon.vue';
    const props = defineProps(['columns', 'filters', 'detail', 'selectionMode', 'spacers', 'updateKey']);
    const el = ref(null);
   
    function updateSpacers() {
        if (el.value) {
            const fixed = (el.value as HTMLElement).querySelectorAll('.fixed');
            let prev: any = null;
            let offset = 0;

            fixed.forEach((f: any, i: number) => {
                if (prev) {
                    const rect = prev.getBoundingClientRect();
                    f.style.left = `${rect.right - offset}px`;
                    f.style.zIndex = 999;
                } else {
                    const rect = f.getBoundingClientRect();
                    offset = rect.left;
                }

                if (i === fixed.length - 1) {
                    f.classList.add('separator');
                }
 
                prev = f;
            });
        }
    }

    function filterChanged(e: any, column: any, clear: boolean = false) {
        let operator = '=';
        if (column.type === 'text') operator = 'contains';

        const event = new CustomEvent('filter', { 
            detail: {
                columnId: column.id,
                value: clear? undefined : e.target.value,
                operator: clear? undefined : operator
            }
        });
        dispatchEvent(event);
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
    <tr ref="el" @keyup.down.stop="onKey($event, true)"  @keyup.up.stop="onKey($event, false)">
        <th v-if="props.detail" class="fixed"></th>
        <th v-if="props.selectionMode" class="fixed"></th>
        <td v-for="column in props.columns" :key="column.id" :class="column.freeze ? 'fixed' : ''">
            <div v-if="props.filters.has(column.id)" class="editor">
                <input name="filter-input" type="text" :value="props.filters.get(column.id).value" @change.stop="filterChanged($event, column)" />
                <div tabindex="0" class="clear" @click.stop="filterChanged($event, column, true)" @keyup.enter.stop="filterChanged($event, column, true)">
                    <svg-icon icon="cross" />
                </div>
            </div>
        </td>
        <td class="filler"></td>
    </tr>
</template>

<style scoped>
tr {
    height: var(--table-group-height);
}

th, td {
    position: sticky;
    top: 36px;  
    z-index: 998;
    box-sizing: border-box;
    padding: 0;
    background-color: var(--table-filter-bar-color);
    border-bottom: 1px solid var(--table-separator-color);
    white-space: nowrap;
}

th:first-child {
    left: 0;
    z-index: 999;
}

.separator {
    border-right: 1px solid var(--table-separator-color);
}

 .filler {
    width: 99%;
}

.editor {
    display: flex;
    align-items: center;
    gap: 4px;
    min-width: 100px;
    height: 32px;
    padding: 0 16px 0 24px;
}

input {
    flex: 1;
    width: 100%;
}

input:focus {
    outline: 1px dashed blue;
    outline-offset: -3px;
}

.clear {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    cursor: pointer;
}

.clear:focus {
    outline: 1px dashed blue;
    outline-offset: -2px;
}
</style>