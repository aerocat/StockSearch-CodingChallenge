<template>
    <div id="chartArea">
        <p> Chart will go here </p>
        {{ stockData }}
    </div>
</template>

<script>
export default {
    name: "Chart",
    props: ['stockData']
}

</script>

<style scoped>
#chartArea {
    width: 600px;
    margin-left: 20px;
    margin-top: 20px;
    padding: 200px 20px;
    text-align: center;
    border: 1px solid #333;
}
</style>
