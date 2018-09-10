module.exports = {
    EPISODES_TO_LIST: 4,
    /**
     * @param {Object[]} arr array which will be shuffled
     * @returns {Object[]} arr
     */
    shuffle: function(arr) {
        // Fisher-Yates shuffle (https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array)
        let j, x, i;
        for (i = arr.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = arr[i];
            arr[i] = arr[j];
            arr[j] = x;
        }
        return arr;
    }
}