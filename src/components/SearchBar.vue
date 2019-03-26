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
    </div>
</template>

<script>
import axios from 'axios';
import { setTimeout } from 'timers';

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

        // Parses the ticker from text inserted in the search bar,
        // queries the API and sends the response to the App component
        searchStock(e) {
            e.preventDefault(); // preventing default form behavior (sending data to a file)

            if (this.filteredResults.length > 0 && this.userInput != '') {
                let ticker = this.userInput.split('-')[1].trim();
                let companyName = this.userInput.split('-')[0].trim();

                let url = `http://localhost:3000/api/${ticker}`;
                axios.get(url)
                .then(res => {
                    this.$emit('received-stock-data', { lineChartPrices: res.data.lineChart,
                                                        candleStickPrices: res.data.candleSticks,
                                                        ticker: ticker.toUpperCase(),
                                                        company: companyName });
                })
                .catch(err => console.log(err));
            }
            this.resetSearch();

        },

        // Listens for changes in the entered text input; potentially auto-completes the field
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
                if (this.filteredResults.length === 1) {
                    this.arrowCounter = 0;
                    setTimeout(() => {
                        this.setResult(this.filteredResults[0]);
                    }, 500);
                }
            }
        },

        // Computes and stores matching results in an array
        filterResults() {
            this.filteredResults = this.tickersAndCompanies.filter(company => 
                // yields only companies where userInput appears in their string (a.k.a indexOf returns a non-negative index)
                company.toLowerCase().indexOf(this.userInput.toLowerCase()) > -1
            );
        },

        // Fills the search bar with a result (used by auto-complete or when a user clicks on a result)
        setResult(selectedResult) {
            if (selectedResult != undefined) {
                this.arrowCounter = -1;
                this.userInput = selectedResult;
                this.isOpen = false;
            }
        },

        // Increases the index of the selected result, so that the class is-active can be rendered onto it
        onArrowDown() {
            if (this.filteredResults.length > 0) {
                if (this.arrowCounter < this.filteredResults.length -1) {
                        this.arrowCounter++;
                    }
            }
        },

        // Decreases the index of the selected result, so that the class is-active can be rendered onto it
        onArrowUp() {
            if (this.filteredResults.length > 0) {
                if (this.arrowCounter > 0) {
                    this.arrowCounter--;
                }
            }
        },

        // Immediately runs a search on the selected result when a user presses the Enter key
        onEnter() {
            if (this.arrowCounter > -1) {
                this.userInput = this.filteredResults[this.arrowCounter];
            }
        },

        // Resets search and closes search results when a user presses the Escape key
        onEsc() {
            this.resetSearch();
        },

        // Helper to reset some component properties after a search is run
        resetSearch() {
            this.userInput = '';
            this.arrowCounter = -1;
            this.isOpen = false;
            this.filteredResults = [];
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
