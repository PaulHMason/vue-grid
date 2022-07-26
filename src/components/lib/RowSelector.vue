<script setup lang="ts">
    import { defineProps, defineEmits } from 'vue';
    const props = defineProps(['selected', 'indeterminate']);
    const emit = defineEmits(['select']);

    function onSelect() {
        emit('select');
    }
</script>

<template>
    <div class="container">
        <input type="checkbox" :checked="props.selected" :indeterminate="props.indeterminate" @change="onSelect" />
    </div>
</template>

<style scoped>
    .container {
        width: var(--table-spacer-size);
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #FAFAFA;
    }

    input {
        margin: 0;
        width: 16px;
        height: 16px;
    }
</style>