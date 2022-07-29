<script setup lang="ts">
    import { defineProps, ref, onMounted } from 'vue';
    const props = defineProps(['columns', 'detail', 'selectionMode', 'spacers', 'renderKey']);
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
</script>

<template>
    <tr ref="el">
        <th v-if="props.detail" class="fixed"></th>
        <th v-if="props.selectionMode" class="fixed"></th>
        <td v-for="column in props.columns" :key="column.label" :class="column.freeze ? 'fixed' : ''">
            <div v-if="column.filterable" class="editor">
                <input type="text" />
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
    background-color: var(--table-filter-bar-color);
    border-bottom: 1px solid var(--table-separator-color);
    white-space: nowrap;
}

th, td {
    position: sticky;
    top: 36px;  
    z-index: 998;
    box-sizing: border-box;
    padding: 0;
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
    min-width: 100px;
    height: 32px;
    padding: 0 16px 0 24px;
}

input {
    width: 100%;
}

input:focus {
    outline: none;
}

</style>