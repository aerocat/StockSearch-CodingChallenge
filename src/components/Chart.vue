<template>
    <div id="chartArea" v-show="toggleChart">
        <!-- <p> Chart will go here </p> -->
        <!-- stockdata: {{ stockData }} -->
        <button @click="toggleCandlesticks"> Toggle Candlestick Chart </button>
        <h3> {{ stockData.company }} ({{ stockData.ticker }}), 1-Month {{ typeOfChart }} Chart </h3>
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
            displayCandlesticks: false,
            typeOfChart: "Line"
        }
    },
    methods: {
        toggleCandlesticks() {
            // e.preventDefault();
            this.displayCandlesticks = true;
            this.typeOfChart = "Candlesticks";
        }
    },
    computed: {
        chartData () {
            let { lineChartPrices, candleSticksPrices, ticker } = this.stockData;
            if (!this.displayCandlesticks) {
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
                                    name: `${ticker} EOD Price`,
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
                            selected: 1
                        },
                        series: [{
                            type: 'candlestick',
                            name: `${ticker} EOD Price`,
                            data: candleSticksPrices,
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
</style>
