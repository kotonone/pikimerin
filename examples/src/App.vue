<script setup lang="ts">
import ScenarioOverlay from './Scenario.vue';
import Background from '/background.webp?url';
</script>

<template>
    <img :src="Background" class="background" />
    <ScenarioOverlay />
</template>

<style scoped>
.background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    image-rendering: pixelated;
}
</style>
