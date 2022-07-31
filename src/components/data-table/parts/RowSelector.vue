<script setup lang="ts">
    import { defineProps, defineEmits, ref } from 'vue';
    const props = defineProps(['selected', 'indeterminate']);
    const emit = defineEmits(['select']);
    const input = ref(null);

    function onSelect() {
        if (input.value) {
            emit('select', (input.value as any).checked);
        }
    }
</script>

<template>
    <div class="container">
        <input tabindex="0" type="checkbox" :checked="props.selected" :indeterminate="props.indeterminate" @change="onSelect" ref="input" />
    </div>
</template>

<style scoped>
    .container {
        width: var(--table-spacer-size);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    input {
        margin: 0;
        width: 16px;
        height: 16px;
    }

    input:focus {
        outline: 1px dashed blue;
        outline-offset: 1px;
    }
</style>