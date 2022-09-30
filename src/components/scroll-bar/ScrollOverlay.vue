<script setup lang="ts">
    import { defineProps, ref, onUnmounted, onUpdated } from 'vue';
    import ScrollBar from './ScrollBar.vue';
    const props = defineProps(['for', 'track']);
    const overlay = ref(null);
    const scrollingVertically = ref(false);
    const scrollingHorizontally = ref(false);
    let initialized = false;
    let scrollTimeout: any;
    let prevScroll = { x: 0, y: 0 };

    const resizeObserver: ResizeObserver = new ResizeObserver(positionOverlay);

    function positionOverlay() {
        if ((!props.for) || (!props.track)) return;

        const f = props.for as any;
        const t = props.track as any;

        const tRect = f.getBoundingClientRect();
        const bRect = t.getBoundingClientRect();

        Object.assign((overlay.value as any).style, {
            left: `${bRect.x + f.scrollLeft}px`,
            top: `${bRect.y + f.scrollTop}px`,
            width: `${f.offsetWidth}px`,
            height: `${f.offsetHeight - (bRect.y - tRect.y + f.scrollTop)}px`,
        });
    }

    function onScroll(e: any) {
        const el = (props.for as any);

        scrollingVertically.value = el.scrollTop !== prevScroll.y;
        scrollingHorizontally.value = el.scrollLeft !== prevScroll.x;
        clearTimeout(scrollTimeout);

        scrollTimeout = scrollTimeout = setTimeout(() => {
            scrollingVertically.value = false;
            scrollingHorizontally.value = false;
        }, 1000);

        prevScroll.x = el.scrollLeft;
        prevScroll.y = el.scrollTop;

        positionOverlay();
    }

    onUpdated(() => {
        if (!initialized && props.for) {
            (props.for as any).addEventListener('scroll', onScroll);
            resizeObserver.observe(props.for);
            positionOverlay();
            initialized = true;
        } 
    });

    onUnmounted(() => {
        if (props.for) {
            (props.for as any).removeEventListener('scroll', onScroll);
            resizeObserver.unobserve(props.for);
        }

        initialized = false;
    });
</script>

<template>
    <div ref="overlay" class="overlay-container">
        <!--
        <div class="scrollbar" orientation="vertical"></div>
        <div class="scrollbar" orientation="horizontal"></div>
        -->
        <scroll-bar :class="scrollingVertically ? 'scrollbar scrolling' : 'scrollbar'" orientation="vertical" />
        <scroll-bar :class="scrollingHorizontally ? 'scrollbar scrolling' : 'scrollbar'" orientation="horizontal" />
        <div class="corner"></div>
    </div>
</template>

<style scoped>
    .overlay-container {
        display: grid;
        grid-template-columns: 1fr auto;
        grid-template-rows: 1fr auto;
        grid-template-areas: "content vscroll"
                             "hscroll corner";
        position: absolute;
        /*background-color: rgba(255, 0, 255, 0.2);*/
        left: 0;
        top: 0;
        pointer-events: none;
        outline: 2px dashed red;
        outline-offset: -2px;
        z-index: 1000;
    }

    .corner {
        pointer-events: auto;
        grid-area: corner;
        background-color: blueviolet;
    }

    .scrollbar {
        pointer-events: auto;
    }

    .scrollbar[orientation="vertical"] {
        grid-area: vscroll;
        width: 2px;
        opacity: 0;
    }

    .scrollbar[orientation="vertical"]:hover, .scrollbar[orientation="vertical"].scrolling {
        width: 17px;
        opacity: 1;
    }

    .scrollbar[orientation="horizontal"] {
        grid-area: hscroll;
        height: 2px;
        opacity: 0;
    }

    .scrollbar[orientation="horizontal"]:hover, .scrollbar[orientation="horizontal"].scrolling {
        height: 17px;
        opacity: 1;
    }
</style>
