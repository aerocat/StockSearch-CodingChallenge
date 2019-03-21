<template>
  <div id="app">
    <Header />
    <SearchBar v-on:received-stock-data="renderStockData" />
    <Chart v-bind:stockData="currentStockData"/>
  </div>
</template>

<script>
import Header from './components/layout/Header.vue'
import SearchBar from './components/SearchBar.vue'
import Chart from './components/Chart.vue'

export default {
  name: 'app',
  components: {
    Header,
    SearchBar,
    Chart,
  },
  data() {
    return {
      currentStockData: {}
    }
  },
  methods: {
    renderStockData(data) {
      this.currentStockData = data;
    }
  }
}
</script>

<style>
/* CSS reset */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
