const express = require('express');
const cors = require('cors');
const procedures = require('./procedures.js');

const app = express();
const port = 3000;
app.use(cors());

// API to fill the search bar results/suggestions
app.get('/api/companies', function(req, res) {
  return procedures.getListOfCompanies(res);
});

// API to retrieve stock data given a ticker. Returns a properly parsed response
app.get('/api/:ticker', function(req, res) {
  let ticker = req.params.ticker;
  return procedures.getStockData(ticker, res);
  
});

// Express Server/App listener
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});