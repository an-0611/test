<template>
    <div class="NoDataContainer">
        <div>No more {{ text }}</div>
    </div>
</template>

<script>

export default {
    name: 'NoData',
    props: {
        text: String,
    },
}
</script>

<style scoped>
    .NoDataContainer {
        width: 100%;
        height: 100%;
        min-height: 50vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
