const axios = require('axios');
const csv = require('csv-parser');  
const fs = require('fs');

// Paths to Exchange CSVs
const NASDAQ = '../assets/csv/NASDAQ.csv';
const NYSE = '../assets/csv/NYSE.csv';
const AMEX = '../assets/csv/AMEX.csv';

// Parses the 3 CSVs to get a list of all companies and then sends it to the client
const getListOfCompanies = (clientResponse) => {

    let allCompanies = [];
    let promise1 = streamToPromise(NASDAQ);
    let promise2 = streamToPromise(NYSE);
    let promise3 = streamToPromise(AMEX);

    Promise.all([promise1, promise2, promise3])
            .then(arrayOfArrays => {
                // this snippet to flatten the final array was taken from https://stackoverflow.com/a/39048868
                let array = [].concat.apply([], arrayOfArrays);    
                allCompanies = removeDuplicates(array);            
            })
            .catch(err => console.log(err))
            .finally(() => {
                clientResponse.send(allCompanies.sort());
            });
}

// Little helper function to remove duplicates from a list, taken from https://stackoverflow.com/a/9229821
// Note: This is a quick fix. A proper solution would have been to parse each result into a Set
const removeDuplicates = array => {
    var seen = {};
    return array.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}

// Converts a Node stream into a Promise
const streamToPromise = (path) => {
    return new Promise((resolve, reject) => {
        let lst = [];
        fs.createReadStream(path)  
            .pipe(csv())
            .on('data', (row) => {
                lst.push(row.Name + " - " + row.Symbol);
            })
            .on('end', () => {
                resolve(lst);
            })
            .on('error', () => {
                reject('Error while parsing csv');
            });
    });
}

// Retrieves stock data from IEX Trading API and sends it to formatData
const getStockData = (ticker, clientResponse) => {
    let url = `https://api.iextrading.com/1.0/stock/${ticker}/chart/1m`;
    axios.get(url)
        .then(res => {
            formatData(res.data, clientResponse);
        })
        .catch(err => {
            console.log(err);
        });
} 

// Formats the data in a way that the charts can understand, then sends it back the client
const formatData = (data, clientResponse) => {
    let objectToSend = {
                            lineChart: [],
                            candleSticks: []
                       };
    for (let row in data) {
        // Converting timestamp to Unix time (in milliseconds)
        let dateInUnixTimeMs = new Date(data[row].date).getTime();

        // Line Chart
        let avgPrice = (data[row].open + data[row].close + data[row].high + data[row].low) / 4;
        objectToSend.lineChart.push([ dateInUnixTimeMs,
                                      avgPrice ]);

        // Candlesticks
        objectToSend.candleSticks.push([ dateInUnixTimeMs,
                                         data[row].open,
                                         data[row].high,
                                         data[row].low,
                                         data[row].close,
                                        ]);
    }
    clientResponse.send(objectToSend);
}

module.exports = {
    getStockData,
    getListOfCompanies,
}