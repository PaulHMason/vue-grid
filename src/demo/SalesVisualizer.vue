<script setup lang="ts">
    import { defineProps, computed, onUpdated, onMounted, ref } from 'vue';

    const props = defineProps(['value', 'row', 'column']);
    const el = ref(null);
    const barSpacing = 2;
    const padding = 8;

    const sales = computed(() => {
        if (props.value) return props.value;
        return props.row ? props.row[props.column?.field] : [];
    });


    function updateChart() {
        const container: any = el.value;
        if (!container) return;

        const count = sales.value.length;
        if (count === 0) return;

        const vw = container.clientWidth;
        const vh = container.clientHeight - 8;

        const min = Math.min(...sales.value);
        const max = Math.max(...sales.value);
        const w = ((vw + barSpacing) / count) - barSpacing;
        const yScale = (min < 0) ? vh / (max - min) : vh / max;
        const origin = vh - (yScale * Math.abs(min));
        const xOffset = w + barSpacing;

        const rects = container.querySelectorAll('rect');

        rects.forEach((rect: any, index: number) => {
            const value = Number(rect.getAttribute('chart-value'));
            const negative = (value < 0);
            const h = (yScale * Math.abs(value));
            const x = index * xOffset;
            let y = negative ? origin : origin - h;

            if (negative) {
                rect.setAttribute('negative', '');
            }

            rect.setAttribute('x', x);
            rect.setAttribute('y', y);
            rect.setAttribute('width', w);
            rect.setAttribute('height', h);
        });
    }

    onUpdated(() => {
        updateChart();
    });

    onMounted(() => {
        updateChart();
    });
</script>

<template>
    <div ref="el" class="chart-container">
        <svg class="chart">
            <g>
                <rect v-for="v in sales" :chart-value="v"></rect>
            </g>
        </svg>
    </div>
</template>

<style scoped>
    .chart-container {
        --bar-sparkline-positive-color: #5c6bc0;
        --bar-sparkline-negative-color: #ec407a;
        width: 100px;
        box-sizing: border-box;
        padding-top: 8px;
        height: calc(var(--table-row-height) - 1px);
    }

    rect {
        fill: var(--bar-sparkline-positive-color);
    }

    rect[negative] {
        fill: var(--bar-sparkline-negative-color);
    }

    .chart {
        width: 100%;
        height: 100%;
    }

</style>
