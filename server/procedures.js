const axios = require('axios');
const csv = require('csv-parser');  
const fs = require('fs');

// Paths to Exchange CSVs
const NASDAQ = '../assets/csv/NASDAQ.csv';
const NYSE = '../assets/csv/NYSE.csv';
const AMEX = '../assets/csv/AMEX.csv';

const getListOfCompanies = (clientResponse) => {
    let lst = [
        "AAPL - Apple Inc." ,
        "FB - Facebook Inc." ,
        "AMZN - Amazon Inc." ,
        "MSFT - Microsoft Inc.",
        "YOOOOOOO - YOOOO Inc."
    ];

    let allCompanies = [];
    let promise1 = streamToPromise(NASDAQ);
    // promise.then(data => console.log('data is', data))
    // .catch(err => console.log("error is:", err));
    let promise2 = streamToPromise(NYSE);
    let promise3 = streamToPromise(AMEX);

    Promise.all([promise1, promise2, promise3])
            .then(arrayOfArrays => {
                allCompanies = [].concat.apply([], arrayOfArrays);                
                // this snippet to flatten the final array was taken from https://stackoverflow.com/a/39048868
            })
            .catch(err => console.log(err))
            .finally(() => {
                // console.log(allCompanies);
                clientResponse.send(allCompanies);
            });
}

/* Old working code
    // let lst2 = [];
    // fs.createReadStream(NASDAQ)  
    //     .pipe(csv())
    //     .on('data', (row) => {
    //         lst2.push(row.Symbol + " - " + row.Name);
    //     })
    //     .on('end', () => {      // this is my .then()
    //         console.log('CSV file successfully processed:');
    //         console.log(lst2);  // do stuff;
    //     });
*/

const streamToPromise = (path) => {
    return new Promise((resolve, reject) => {
        let lst = [];
        fs.createReadStream(path)  
            .pipe(csv())
            .on('data', (row) => {
                lst.push(row.Symbol + " - " + row.Name);
            })
            .on('end', () => {
                resolve(lst);
            })
            .on('error', () => {
                reject('Error while parsing csv');
            });
    });
}


const getStockData = (ticker, clientResponse) => {
    let url = `https://api.iextrading.com/1.0/stock/${ticker}/chart/1m`;
    axios.get(url)
        .then(res => {
            // manipulate/parse data in other function
            manipulateData(res.data, clientResponse);
        })
        .catch(err => {
            console.log(err);
        });
} 

const manipulateData = (data, clientResponse) => {
    // do stuff
    // ...

    clientResponse.send(data);
}

module.exports = {
    getStockData,
    getListOfCompanies,
}