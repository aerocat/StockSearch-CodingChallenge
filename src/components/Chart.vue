<template>
    <div class="chart-component">
        <div v-if="!toggleChart" class="empty-chart">
             <h3> Hi! Please search a stock in the text box above :) </h3>
        </div>
        <div class="chart-container" v-if="toggleChart">
            <div class="chart-toggle">
                <div class="chart-title">
                        <h3> {{ stockData.company }} ({{ stockData.ticker }}), 1-Month {{ !displayCandlestick ? "Line" : "Candlestick (Daily)" }} Chart </h3>
                </div>
                    <img src="../../assets/icons/line-chart.png" v-if="displayCandlestick"/>
                    <img src="../../assets/icons/candlesticks.png" v-if="!displayCandlestick" class="smaller-img"/>
                    <button @click="toggleChartType">  Toggle {{ displayCandlestick ? "Line" : "Candlestick" }} Chart </button>
        </div>
          <div class="chart-area">
                <div class="chart">
                    <highcharts :constructor-type="'stockChart'" :options="chartData" :key="componentKey"></highcharts>
                </div>
          </div>
    </div>
    </div>
</template>

<script>
import { Chart } from 'highcharts-vue';
import Highcharts from 'highcharts';
import stockInit from 'highcharts/modules/stock';

stockInit(Highcharts);

export default {
    name: "Chart",
    props: ['stockData', 'toggleChart'],
    components: {
        highcharts: Chart
    },
    data() {
        return {
            displayCandlestick: false,
            componentKey: 0
        }
    },
    methods: {
        
        // Flip boolean variable to display the line or the candlestick charts
        toggleChartType() {
            this.displayCandlestick = !this.displayCandlestick;
            // This is used to forcefully destroy and recreate the chart object
            this.componentKey++;
        }
    },
    computed: {

        // Computed property to provide the highcharts component with the data it needs
        chartData () {
            let { lineChartPrices, candleStickPrices, ticker } = this.stockData;
            
            // Display Line Chart
            if (!this.displayCandlestick) {
                 return {
                        rangeSelector: {
                            allButtonsEnabled: false,
                            buttons: [],
                            labelStyle: {
                                visibility: 'hidden'
                            }
                        },
                        series: [{
                                    name: `${ticker} OHLC Price`,
                                    data: lineChartPrices,
                                    marker: {
                                        enabled: true,
                                        radius: 3
                                    },
                                    shadow: true,
                                    tooltip: {
                                        valueDecimals: 2
                                    }
                                }]
                }
            } else { // Display Candlestick Chart
                return {
                        rangeSelector: {
                            allButtonsEnabled: false,
                            buttons: [],
                            labelStyle: {
                                visibility: 'hidden'
                            }
                        },
                        series: [{
                            type: 'candlestick',
                            name: `${ticker} Price`,
                            data: candleStickPrices,
                            dataGrouping: {
                                units: [
                                    [
                                        'week', // unit name
                                        [1] // allowed multiples
                                    ], [
                                        'month',
                                        [1, 2, 3, 4, 6]
                                    ]
                                ]
                            }
                        }]
                }
            }
        }
    }
}

</script>

<style scoped>

.chart-component {
    width: 1000px;
    height: 600px;
    margin-top: 100px;
    padding: 20px;
    text-align: left;
    border: 1px dashed #333;
    display: flex;
    justify-content: center;
}

.empty-chart {
    height: 50px;
    flex-basis: 480px;
    align-self: center;
}

.chart-title {
    flex: 10;
    height: 25px;
    align-self: center;
}

.chart-toggle {
    display: flex;
    flex-basis: 300px;
    height: 80px;
}

.chart-toggle img {
    width: 80px;
}

.chart-toggle button {
    flex: 3;
    height: 25px;
    align-self: center;
}

.smaller-img {
    width: 65px !important;
    height: 65px;
    align-self: center;
}

.chart-container {
    flex-basis: 1000px;
}

</style>
