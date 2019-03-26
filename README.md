# Stock Chart - Coding Challenge

This project was built as a coding challenge for an unnamed firm in Chicago. It's a web application that allows a user to search for a stock or public company (listed on NASDAQ, NYSE or AMEX exchanges) and retrieve a chart for the stock movements for the past month.

The web app utilizes Vue.js on the front-end and Node.js/Express on the back-end.

### How to install this project:

```sh
git clone https://github.com/aerocat/StockSearch-CodingChallenge.git
cd StockSearch-CodingChallenge
npm install
```

### How to run this project:
After installing the project, you should run the back-end:
```sh
cd server
node app.js
```
*hint: don't run ```node server/app.js``` from the main project directory. The app won't be able to find the CSV folder...*

Then, run the front-end in a separate Terminal/bash window:

```sh
npm run serve
```

At this point you should be able to view the webapp by visiting http://localhost:8080/ on your browser.

Happy stock searching!