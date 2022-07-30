<script setup lang="ts">
    import { defineProps, ref, onMounted } from 'vue';
    import SvgIcon from '../../svg-icon/SvgIcon.vue';
    const props = defineProps(['columns', 'filters', 'detail', 'selectionMode', 'spacers']);
    const el = ref(null);

    onMounted(() => {
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
    });

    function filterChanged(e, column: Column, clear: boolean = false) {
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
</script>

<template>
    <tr ref="el">
        <th v-if="props.detail" class="fixed"></th>
        <th v-if="props.selectionMode" class="fixed"></th>
        <td v-for="column in props.columns" :key="column.label" :class="column.freeze ? 'fixed' : ''">
            <div v-if="props.filters.has(column.id)" class="editor">
                <input type="text" :value="props.filters.get(column.id).value" @change.stopPropagation="filterChanged($event, column)" />
                <div class="clear" @click.stopPropagation="filterChanged($event, column, true)">
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
    outline: none;
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

</style>