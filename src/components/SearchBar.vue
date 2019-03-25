<template>
    <div>
        <form @submit="searchStock">
            <input type="text"
                   v-model="userInput"
                   @input="onChange"
                   @keydown.down="onArrowDown"
                   @keydown.up="onArrowUp"
                   @keydown.enter="onEnter"
                   @keydown.esc="onEsc"
                   placeholder="Enter a stock name or ticker"/>
            <input type="submit" value="Search" class="btn"/>
        </form>

        <div class="search-dropdown">
            <ul v-show="isOpen" class="search-results">
                    <li v-for="(result, index) in filteredResults"
                        v-bind:key="index" 
                        @click="setResult(result)"
                        class="search-result"
                        v-bind:class="{ 'is-active': index === arrowCounter }"> {{ result }} </li>
                    <li v-if="filteredResults.length == 0"> No Stocks Found :( </li>
            </ul>
        </div>
        <!-- <h3> userInput is: {{ userInput }} </h3> -->
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "SearchBar",
    data() {
        return {
            userInput: '',
            tickersAndCompanies: [],
            isOpen: false,
            filteredResults: [],
            arrowCounter: -1
        }
    },
    created: function () {        
        let url = `http://localhost:3000/api/companies`;
        axios.get(url)
            .then(res => {
                this.tickersAndCompanies = res.data;
            })
            .catch(err => console.log(err));
    },
    methods: {
        searchStock(e) {
            e.preventDefault(); // preventing default form behavior (sending data to a file)
            let ticker = this.userInput.split('-')[1].trim();
            let companyName = this.userInput.split('-')[0].trim();
            
            console.log('about to search:', ticker);
            // TODO: Add validation so user can't search something invalid
            // like if ticker not in tickers, disable search button

            let url = `http://localhost:3000/api/${ticker}`;
            axios.get(url)
            .then(res => {
                this.$emit('received-stock-data', { lineChartPrices: res.data.lineChart,
                                                    candleStickPrices: res.data.candleSticks,
                                                    ticker: ticker.toUpperCase(),
                                                    company: companyName });
            })
            .catch(err => console.log(err));
            this.userInput = '';
        },
        onChange() {
            // If user hasn't entered text or has deleted it
            if (this.userInput === '') {
                this.isOpen = false;
                this.arrowCounter = -1;
            }
            // else, input is valid
            else {
                this.isOpen = true;
                this.filterResults();

                // Autocomplete field if there's only one result found
                if (this.filteredResults.length == 1) {
                    this.setResult(this.filteredResults[0]);
                }
            }
        },
        filterResults() {
            this.filteredResults = this.tickersAndCompanies.filter(company => 
                // yields only companies where userInput appears in their string (a.k.a indexOf returns a non-negative index)
                company.toLowerCase().indexOf(this.userInput.toLowerCase()) > -1
            );
            console.log('Matching results:', this.filteredResults.length);
        },
        setResult(selectedResult) {
            this.arrowCounter = -1;
            this.userInput = selectedResult;
            this.isOpen = false;
        },
        onArrowDown() {
            if (this.filteredResults.length > 0) {
                if (this.arrowCounter < this.filteredResults.length -1) {
                        this.arrowCounter++;
                        console.log("this.arrowCounter: ", this.arrowCounter);
                    }
            }
        },
        onArrowUp() {
            if (this.filteredResults.length > 0) {
                if (this.arrowCounter > 0) {
                    this.arrowCounter--;
                    console.log("this.arrowCounter: ", this.arrowCounter);
                }
            }
        },
        onEnter() {
            // e.preventDefault();
            if (this.arrowCounter > -1) {
                this.userInput = this.filteredResults[this.arrowCounter];     // I probably want to leave the default behavior here
                console.log('this.userInput: ', this.userInput);
                this.arrowCounter = -1;
                this.isOpen = false;
            }
        },
        onEsc() {
            this.isOpen = false;
            this.arrowCounter = -1;
        }
    }
}

</script>

<style scoped>

form {
    display: flex;
}

input[type="text"] {
    flex: 10;
    padding: 5px;
}

input[type="submit"] {
    flex: 2;
}

.search-dropdown {
    flex: 8;
}

.search-results {
    padding: 0;
    margin: 0;
    border: 1px solid #eeeeee;
    height: 200px;
    overflow: auto;
}

.search-result {
    list-style: none;
    text-align: left;
    padding: 4px 2px;
    cursor: pointer;
}

.search-result.is-active,
.search-result:hover {
    background-color: #4AAE9B;
    color: white;
}

.btn {
    display: inline-block;
    border: none;
    background: #555;
    color: #fff;
    padding: 7px 20px;
    cursor: pointer;
}

.btn:hover {
    background: #666;
}
</style>
