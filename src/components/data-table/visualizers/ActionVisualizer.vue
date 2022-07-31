<script setup lang="ts">
    import { defineProps } from 'vue';
    const props = defineProps(['value', 'action', 'rowId']);
</script>

<template>
    <div class="container">
        <button @click="props.action ? props.action(props.rowId) : null">{{props.value}}</button>
    </div>
</template>

<style scoped>
    .container {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    button {
        text-transform: uppercase;
        font-weight: 500;
        border: none;
        padding: 4px 16px;
        border-radius: 4px;
        background-color: transparent;
        color: cornflowerblue;
        cursor: pointer;
    }

    button:hover {
        background-color: #F0F0F0;
    }

    button:focus {
        outline: 1px dashed blue;
        outline-offset: -1px;
    }
</style>