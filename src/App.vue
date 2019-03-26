<template>
  <div id="app">
    <Header />
    <SearchBar v-on:received-stock-data="renderStockData" />
    <Chart class="chart-component" v-bind:stockData="dataFromAPI" v-bind:toggleChart="showChart"/>
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
      dataFromAPI: {},
      showChart: false
    }
  },
  methods: {
    renderStockData(data) {
      this.dataFromAPI = data;
      this.showChart = true;
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
  display: flex;
  flex-direction: column;
}


.chart-component {
  align-self: center;
}

</style>
