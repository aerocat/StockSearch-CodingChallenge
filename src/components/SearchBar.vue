<template>
    <div id="searchBar">
        <form @submit="searchStock">
            <input type="text" v-model="userInput" placeholder="Enter a stock name or ticker">
            <input type="submit" value="Search" class="btn">
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
            userInput: ''
        }
    },
    methods: {
        searchStock(e) {
            e.preventDefault(); // preventing default form behavior (sending data to a file)
            let url = `https://api.iextrading.com/1.0/stock/${this.userInput}/chart/1m`
            axios.get(url)
            .then(res => {
                this.$emit('received-stock-data', res.data);
            })
            .catch(err =>{
                console.log(err)
            });
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
