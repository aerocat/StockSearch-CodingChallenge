<template>
    <div id="searchBar">
        <form @submit="searchStock">
            <input type="text" list="stocks" v-model="userInput" placeholder="Enter a stock name or ticker">
            <input type="submit" value="Search" class="btn">
            <datalist id="stocks">
                <option v-for="ticker in tickersAndCompanies" v-bind:key="ticker"> {{ticker}} </option>
            </datalist>
        </form>
        {{ userInput }}
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "SearchBar",
    data() {
        return {
            userInput: '',
            tickersAndCompanies: []
        }
    },
    created: function () {
        // let lst = [
        //             "AAPL - Apple Inc." ,
        //             "FB - Facebook Inc." ,
        //             "AMZN - Amazon Inc." ,
        //             "MSFT - Microsoft Inc." ]
        
        let url = `http://localhost:3000/api/companies`;
        axios.get(url)
            .then(res => {
                this.tickersAndCompanies = res.data;
            })
            .catch(err => console.log(err));

        // I could use a foreach or map to filter/format data how I want it
        // ...

        // this.tickersAndCompanies = lst;
    },
    methods: {
        searchStock(e) {
            e.preventDefault(); // preventing default form behavior (sending data to a file)
            let url = `http://localhost:3000/api/${this.userInput}`;
            axios.get(url)
            .then(res => {
                this.$emit('received-stock-data', res.data);
            })
            .catch(err => console.log(err));
            this.userInput = '';
        }
    }
}

</script>

<style scoped>
#searchBar {
    /* general styling to be added... */
}
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
