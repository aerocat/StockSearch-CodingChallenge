<template>
    <div id="chartArea" v-show="toggleChart">
        <!-- <p> Chart will go here </p> -->
        <!-- stockdata: {{ stockData }} -->
        <button class="toggle-chart-type" @click="toggleChartType"> Toggle {{ displayCandlestick ? "Line" : "Candlestick" }} Chart </button>
        <h3> {{ stockData.company }} ({{ stockData.ticker }}), 1-Month {{ !displayCandlestick ? "Line" : "Candlestick (Daily)" }} Chart </h3>
        <highcharts :constructor-type="'stockChart'" :options="chartData"></highcharts>
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
        highcharts: Chart,

    },
    data() {
        return {
            displayCandlestick: false
        }
    },
    methods: {
        toggleChartType() {
            this.displayCandlestick = !this.displayCandlestick;
        }
    },
    computed: {
        chartData () {
            console.log('running chartData');
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
                                    name: `${this.stockData.ticker} EOD Price`,
                                    data: this.stockData.lineChartPrices,
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
                            selected: 1
                        },
                        series: [{
                            type: 'candlestick',
                            name: `${this.stockData.ticker} Price`,
                            data: this.stockData.candleStickPrices,
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
#chartArea {
    width: 800px;
    margin-top: 20px;
    margin-left: 20px;
    /* Find a way to align to center? */
    padding: 20px 20px;
    text-align: left;
    /* border: 1px solid #333; */
}

.toggle-chart-type {
    float: right;
}
</style>
