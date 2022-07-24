<script setup lang="ts">
    import { defineProps, ref } from 'vue';
    import BodyCell from './BodyCell.vue';
    import GroupRowToggle from './GroupRowToggle.vue';
    import BodyRow from './BodyRow.vue';

    const props = defineProps(['columns', 'row', 'detail', 'spacers']);
    const showDetail = ref(false);

    function getOffset() {
        return `padding-left: ${(props.row.level - 1) * 48}px`;
    }

    function toggleDetail() {  
        showDetail.value = !showDetail.value;
    }
</script>

<template>
    <tr class="group">
        <td colspan="10000" class="group">
            <div class="group-row" :style="getOffset()">
                <GroupRowToggle :showing="showDetail" @click="toggleDetail" />
                <span>{{row.label}}</span>
            </div>
        </td>
    </tr>
    <template v-if="showDetail">
        <template v-for="row in row.__items" :key="row.id">
            <group-row v-if="row.__items" :columns="props.columns" :row="row" :detail="detail" :spacers="spacers" />
            <body-row v-else :columns="props.columns" :row="row" :detail="detail" :spacers="spacers" />
        </template>
    </template>
    
</template>

<style scoped>
    .group-row {
        display: flex;
        align-items: center;
        gap: 16px;
    }

    tr.group {
        height: 40px;
        font-size: 14px;
        font-weight: 500;
        background-color: #FAFAFA;
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    }

    td.group {
        padding: 0;
    }
</style>