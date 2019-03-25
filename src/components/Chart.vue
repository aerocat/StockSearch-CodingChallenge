<template>
    <div id="chartArea" v-show="toggleChart">
        <!-- <p> Chart will go here </p> -->
        <!-- stockdata: {{ stockData }} -->
        <h3> {{ stockData.company }} ({{ stockData.ticker }}), 1-Month Line Chart </h3>
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
    computed: {
        chartData () {
            return (
                    {
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
                                data: this.stockData.prices,
                                marker: {
                                    enabled: true,
                                    radius: 3
                                },
                                shadow: true,
                                tooltip: {
                                    valueDecimals: 2
                                }
                            }],
                    title: {
                            // text: `${this.stockData.company} 1-Month Chart`
                    }
                }
            )
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
