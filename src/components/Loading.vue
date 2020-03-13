<template>
    <div class="loadingContainer">
        <div>Loading...</div>
    </div>
</template>

<script>

export default {
  name: 'Loading',
}
</script>

<style scoped>
    .loadingContainer {
        width: 100%;
        height: 100%;
        min-height: 50vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
