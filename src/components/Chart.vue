<template>
    <div class="chartComponent">
        <div v-if="!toggleChart" class="empty-chart">
             <h3> Hi! Please search a stock in the text box above :) </h3>
        </div>
        <div class="chartContainer" v-if="toggleChart">
            <div class="chart-toggle">
                <div class="chartTitle">
                        <h3> {{ stockData.company }} ({{ stockData.ticker }}), 1-Month {{ !displayCandlestick ? "Line" : "Candlestick (Daily)" }} Chart </h3>
                </div>
                    <img src="../../assets/icons/line-chart.png" v-if="displayCandlestick"/>
                    <img src="../../assets/icons/candlesticks.png" v-if="!displayCandlestick" class="smaller-img"/>
                    <button @click="toggleChartType">  Toggle {{ displayCandlestick ? "Line" : "Candlestick" }} Chart </button>
        </div>
          <div class="chartArea">
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
        toggleChartType() {
            this.displayCandlestick = !this.displayCandlestick;
            // This is used to forcefully destroy and recreate the chart object
            this.componentKey++;
        }
    },
    computed: {
        chartData () {
            let { lineChartPrices, candleStickPrices, ticker } = this.stockData;
            
            if (!this.displayCandlestick) {
                 return {
                        rangeSelector: {
                            allButtonsEnabled: false,
                            buttons: [
                            //     {
                            //     type: 'month',
                            //     count: 1,
                            //     text: '1m'
                            // }
                            ],
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
            } else {
                return {
                        rangeSelector: {
                            allButtonsEnabled: false,
                            buttons: [
                            //     {
                            //     type: 'month',
                            //     count: 1,
                            //     text: '1m'
                            // }
                            ],
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

.chartComponent {
    width: 1000px;
    height: 600px;
    margin-top: 20px;
    margin-left: 20px;
    padding: 0 20px;
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

.chartTitle {
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

.chartContainer {
    flex-basis: 1000px;
}


</style>
